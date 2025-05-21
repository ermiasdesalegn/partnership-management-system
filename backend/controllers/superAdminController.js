import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { generateRandomPassword } from '../utils/passwordUtils.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/helpers.js';
import bcrypt from 'bcrypt';

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get all admins
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password');
    res.status(200).json({
      status: 'success',
      data: admins
    });
  } catch (error) {
    next(error);
  }
};

// Create internal user
export const createInternalUser = async (req, res, next) => {
  try {
    const { email, name, department } = req.body;
    console.log('Creating internal user:', { email, name, department });

    if (!email || !name) {
      return next(new AppError('Email and name are required', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists', 400));
    }

    // Generate temporary password
    const tempPassword = generateRandomPassword();
    console.log('Generated temporary password:', tempPassword);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);
    console.log('Hashed password:', hashedPassword);

    // Generate setup token
    const setupToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create new user with temporary password
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      role: 'internal',
      department: department || 'Internal',
      company: {
        name: 'Internal Organization',
        type: 'Government'
      },
      isPasswordTemporary: true
    });

    console.log('Created user:', user);

    // In a real application, you would send an email here
    // For testing, we'll return the setup link
    const setupLink = `http://localhost:5173/setup-password?token=${setupToken}`;

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department
        },
        setupLink
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    next(error);
  }
};

// Setup password for internal user
export const setupInternalUserPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    console.log('Setting up password for token:', token);

    if (!token || !password) {
      return next(new AppError('Token and password are required', 400));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;
    console.log('Decoded email:', email);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('New password hash:', hashedPassword);

    // Update user directly using findOneAndUpdate to bypass pre-save middleware
    const updatedUser = await User.findOneAndUpdate(
      { email, isPasswordTemporary: true },
      { 
        password: hashedPassword,
        isPasswordTemporary: false
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(new AppError('User not found or password already set', 404));
    }

    console.log('Password updated successfully for user:', updatedUser.email);

    res.status(200).json({
      status: 'success',
      message: 'Password set successfully'
    });
  } catch (error) {
    console.error('Error setting up password:', error);
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid or expired token', 401));
    }
    next(error);
  }
};

// Remove user
export const removeUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'User removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Create admin
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return next(new AppError('Name, email and role are required', 400));
    }

    // Validate role
    if (!['partnership-division', 'law-department', "director", 'general-director', 'super-admin', 'general'].includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(new AppError('Admin already exists', 400));
    }

    // Generate temporary password
    const tempPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Generate setup token
    const setupToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create new admin with temporary password
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      isPasswordTemporary: true
    });

    // In a real application, you would send an email here
    // For testing, we'll return the setup link
    const setupLink = `http://localhost:5173/admin/setup-password?token=${setupToken}`;

    res.status(201).json({
      status: 'success',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive
        },
        setupLink
      }
    });
  } catch (error) {
    next(error);
  }
};

// Remove admin
export const removeAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.params;

    // Prevent self-removal
    if (adminId === req.admin._id.toString()) {
      return next(new AppError('Cannot remove yourself', 400));
    }

    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      return next(new AppError('Admin not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Admin removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get current super admin
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return next(new AppError('Admin not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        admin
      }
    });
  } catch (error) {
    next(error);
  }
};

// Setup password for admin
export const setupAdminPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    console.log('Setting up password for admin token:', token);

    if (!token || !password) {
      return next(new AppError('Token and password are required', 400));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;
    console.log('Decoded email:', email);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('New password hash:', hashedPassword);

    // Update admin directly using findOneAndUpdate to bypass pre-save middleware
    const updatedAdmin = await Admin.findOneAndUpdate(
      { email, isPasswordTemporary: true },
      { 
        password: hashedPassword,
        isPasswordTemporary: false
      },
      { new: true }
    );

    if (!updatedAdmin) {
      return next(new AppError('Admin not found or password already set', 404));
    }

    console.log('Password updated successfully for admin:', updatedAdmin.email);

    res.status(200).json({
      status: 'success',
      message: 'Password set successfully'
    });
  } catch (error) {
    console.error('Error setting up password:', error);
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid or expired token', 401));
    }
    next(error);
  }
}; 