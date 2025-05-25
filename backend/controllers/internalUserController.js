import User from '../models/User.js';
import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Request from '../models/Request.js';

export const loginInternalUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists
    const user = await User.findOne({ email }).select('+password');
    console.log('Found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Check if password is correct
    console.log('Comparing passwords...');
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log('Password correct:', isPasswordCorrect);
    console.log('User role:', user.role);
    console.log('User password hash:', user.password);

    if (!isPasswordCorrect) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 4) Check if user is internal
    if (user.role !== 'internal') {
      return next(new AppError('This account is not authorized to access this system', 403));
    }
 
    // 5) If everything ok, send token to client7
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }
    );

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's requests
    const requests = await Request.find({ userRef: userId });
    
    // Calculate stats
    const stats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter(req => req.status === 'pending').length,
      completedRequests: requests.filter(req => ['approved', 'disapproved'].includes(req.status)).length
    };

    // Get recent requests (last 5)
    const recentRequests = await Request.find({ userRef: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt');

    // Get recent notifications (last 5)
    const recentRequestsForNotifications = await Request.find({ userRef: userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title status updatedAt')
      .exec();

    const notifications = recentRequestsForNotifications.map(request => ({
      title: `Request ${request.status}`,
      message: `Your request "${request.title}" has been ${request.status}`,
      createdAt: request.updatedAt
    }));

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        recentRequests,
        notifications
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { password, role, ...updateData } = req.body;

    if (password) {
      return next(new AppError('This route is not for password updates', 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all requests for this user
    const requests = await Request.find({ userRef: userId })
      .sort({ createdAt: -1 })
      .select('status createdAt updatedAt frameworkType companyDetails attachments department');

    if (!requests || requests.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          requests: [],
          message: 'No requests found for this user'
        }
      });
    }

    // Get the current user's details
    const user = await User.findById(userId).select('name email phone department');

    // Format the response to match the frontend expectations
    const formattedRequests = requests.map(request => ({
      _id: request._id,
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      frameworkType: request.frameworkType,
      userDetails: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department
      },
      companyDetails: request.companyDetails || {},
      attachments: request.attachments || [],
      department: request.department || user.department // Include department from request or fallback to user's department
    }));

    res.status(200).json({
      status: 'success',
      data: {
        requests: formattedRequests
      }
    });
  } catch (error) {
    console.error('Error in getAllRequests:', error);
    next(error);
  }
}; 