// controllers/userController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import Request from "../models/Request.js";
import catchAsync from "../utils/catchAsync.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory for file operations
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to clean up files from filesystem
const cleanupFile = (filename) => {
  if (!filename) return;
  
  const filePath = path.join(__dirname, '../public/uploads', filename);
  
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file ${filename}:`, err);
    } else {
      console.log(`Successfully deleted file: ${filename}`);
    }
  });
};

// JWT token generation function
const signToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide name, email, and password"
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: "external",
      company: companyName ? { name: companyName } : undefined
    });

    const token = signToken(newUser._id);
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists"
      });
    }
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

export const googleSignup = async (req, res) => {
  try {
    const { name, email, googleId, picture } = req.body;

    // Validate required fields
    if (!name || !email || !googleId) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required Google authentication data"
      });
    }

    // Check if user already exists with this email
    let existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // If user exists but doesn't have Google ID, update it
      if (!existingUser.googleId) {
        existingUser.googleId = googleId;
        existingUser.picture = picture;
        await existingUser.save();
      }
      
      const token = signToken(existingUser._id);
      
      return res.status(200).json({
        status: "success",
        token,
        data: { 
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            picture: existingUser.picture
          }
        }
      });
    }

    // Create new user with Google data
    const newUser = await User.create({
      name,
      email,
      googleId,
      picture,
      role: "external",
      password: Math.random().toString(36).slice(-8) + 'Aa1!' // Generate random password since it's required
    });

    const token = signToken(newUser._id);
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: { 
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          picture: newUser.picture
        }
      }
    });

  } catch (error) {
    console.error('Google signup error:', error);
    res.status(400).json({
      status: "fail",
      message: error.message || "Google signup failed"
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({ email }).select("+password");
    
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password"
      });
    }

    const token = signToken(user._id);
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

// Rest of the controller methods remain the same...
// (logout, getMe, updateMe, updateMyPassword, deleteMe)

export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.status(200).json({ 
    status: "success", 
    message: "Logged out successfully" 
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: { user }
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { password, role, ...updateData } = req.body;

    if (password) {
      return res.status(400).json({
        status: "fail",
        message: "This route is not for password updates"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      status: "success",
      data: { user: updatedUser }
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

export const updateMyPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.correctPassword(req.body.currentPassword))) {
      return res.status(401).json({
        status: "fail",
        message: "Current password is incorrect"
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      data: { user }
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

export const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    
    res.status(204).json({
      status: "success",
      data: null
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

export const createRequest = catchAsync(async (req, res, next) => {
  // Validate required fields
  if (!req.body.companyDetails) {
    return next(new AppError('Missing required fields', 400));
  }

  // Parse company details
  let companyDetails;
  try {
    companyDetails = JSON.parse(req.body.companyDetails);
  } catch (error) {
    return next(new AppError('Invalid JSON format for company details', 400));
  }

  // Validate company details
  if (!companyDetails.name || !companyDetails.type || !companyDetails.email) {
    return next(new AppError('Company name, type, and email are required', 400));
  }

  // Get user details from the authenticated user
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Create new request
  const newRequest = await Request.create({
    userRef: req.user.id,
    type: "external",
    status: "pending",
    currentStage: "partnership-division",
    companyDetails: {
      ...companyDetails,
      // Ensure enum values match
      type: ["Government", "Private", "Non-Government", "Other"].includes(companyDetails.type)
        ? companyDetails.type
        : "Other"
    },
    attachments: req.files ? req.files.map(file => ({
      path: file.path.replace(/\\/g, '/'),
      originalName: file.originalname,
      uploadedBy: req.user.id,
      uploaderModel: 'User'
    })) : []
  });

  res.status(201).json({
    status: 'success',
    data: {
      request: newRequest
    }
  });
});

export const updateRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  // Validate request ID format
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid request ID format', 400));
  }
  
  // Find the request and verify ownership
  const existingRequest = await Request.findOne({
    _id: id,
    userRef: req.user.id
  });

  if (!existingRequest) {
    return next(new AppError('Request not found or you are not authorized to edit it', 404));
  }

  // Check if request can be edited (only pending requests)
  if (existingRequest.status?.toLowerCase().trim() !== 'pending') {
    return next(new AppError('Only pending requests can be edited', 400));
  }

  // Rate limiting check - prevent too frequent updates (optional)
  const lastUpdated = existingRequest.updatedAt || existingRequest.createdAt;
  const timeSinceLastUpdate = Date.now() - new Date(lastUpdated).getTime();
  const minUpdateInterval = 30000; // 30 seconds minimum between updates
  
  if (timeSinceLastUpdate < minUpdateInterval) {
    return next(new AppError('Please wait before making another update', 429));
  }

  // Validate and parse company details if provided
  let companyDetails = existingRequest.companyDetails;
  if (req.body.companyDetails) {
    try {
      const parsedCompanyDetails = JSON.parse(req.body.companyDetails);
      
      // Validate required fields
      if (!parsedCompanyDetails.name || !parsedCompanyDetails.type || !parsedCompanyDetails.email) {
        return next(new AppError('Company name, type, and email are required', 400));
      }

      companyDetails = {
        ...parsedCompanyDetails,
        // Ensure enum values match
        type: ["Government", "Private", "Non-Government", "Other"].includes(parsedCompanyDetails.type)
          ? parsedCompanyDetails.type
          : "Other"
      };
    } catch (error) {
      return next(new AppError('Invalid JSON format for company details', 400));
    }
  }

  // Handle file operations
  let updatedAttachments = [...existingRequest.attachments];

  // Handle removed attachments
  if (req.body.removedAttachments) {
    try {
      const removedAttachmentIds = JSON.parse(req.body.removedAttachments);
      
      // Remove from attachments array and clean up files
      updatedAttachments = updatedAttachments.filter(attachment => {
        if (removedAttachmentIds.includes(attachment._id?.toString())) {
          // Clean up the actual file from filesystem
          cleanupFile(attachment.path);
          console.log(`Removing attachment: ${attachment.path}`);
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Error parsing removed attachments:', error);
    }
  }

  // Add new attachments
  if (req.files && req.files.length > 0) {
    // Validate total attachment count (max 10 files)
    const totalAttachments = updatedAttachments.length + req.files.length;
    if (totalAttachments > 10) {
      return next(new AppError('Maximum 10 attachments allowed per request', 400));
    }

    const newAttachments = req.files.map(file => ({
      path: file.filename, // Store just the filename
      originalName: file.originalname,
      uploadedBy: req.user.id,
      uploaderModel: 'User',
      uploadedAt: new Date(),
      size: file.size,
      mimetype: file.mimetype
    }));
    updatedAttachments = [...updatedAttachments, ...newAttachments];
  }

  // Create modification record for audit trail
  const modificationRecord = {
    modifiedAt: new Date(),
    modifiedBy: req.user.id,
    modificationReason: 'User edit',
    changedFields: []
  };

  // Track what fields were changed
  if (req.body.companyDetails) {
    modificationRecord.changedFields.push('companyDetails');
  }
  if (req.body.removedAttachments || (req.files && req.files.length > 0)) {
    modificationRecord.changedFields.push('attachments');
  }

  // Update the request
  const updatedRequest = await Request.findByIdAndUpdate(
    id,
    {
      companyDetails,
      attachments: updatedAttachments,
      updatedAt: new Date(),
      lastModifiedBy: req.user.id,
      $push: { modificationHistory: modificationRecord }
    },
    {
      new: true,
      runValidators: true
    }
  );

  // Get user details for response formatting
  const user = await User.findById(req.user.id).select('name email phone');

  // Format the response
  const formattedRequest = {
    _id: updatedRequest._id,
    status: updatedRequest.status,
    createdAt: updatedRequest.createdAt,
    updatedAt: updatedRequest.updatedAt,
    frameworkType: updatedRequest.frameworkType,
    duration: updatedRequest.duration,
    userDetails: {
      name: user.name,
      email: user.email,
      phone: user.phone
    },
    companyDetails: updatedRequest.companyDetails || {},
    attachments: updatedRequest.attachments || []
  };

  res.status(200).json({
    status: 'success',
    message: 'Request updated successfully',
    data: {
      request: formattedRequest
    }
  });
});

export const deleteRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  // Validate request ID format
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid request ID format', 400));
  }
  
  // Find the request and verify ownership
  const existingRequest = await Request.findOne({
    _id: id,
    userRef: req.user.id
  });

  if (!existingRequest) {
    return next(new AppError('Request not found or you are not authorized to delete it', 404));
  }

  // Check if request can be deleted (only pending requests)
  if (existingRequest.status?.toLowerCase().trim() !== 'pending') {
    return next(new AppError('Only pending requests can be deleted', 400));
  }

  // Clean up all associated files
  if (existingRequest.attachments && existingRequest.attachments.length > 0) {
    existingRequest.attachments.forEach(attachment => {
      if (attachment.path) {
        cleanupFile(attachment.path);
        console.log(`Cleaning up file during deletion: ${attachment.path}`);
      }
    });
  }

  // Delete the request from database
  await Request.findByIdAndDelete(id);

  // Log the deletion for audit purposes
  console.log(`Request ${id} deleted by user ${req.user.id} at ${new Date().toISOString()}`);

  res.status(200).json({
    status: 'success',
    message: 'Request deleted successfully'
  });
});

export const getRequestStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the current user's details first
    const user = await User.findById(userId).select('name email phone');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Find all requests for this user with all necessary fields
    const requests = await Request.find({ userRef: userId })
      .sort({ createdAt: -1 })
      .select('status createdAt updatedAt frameworkType duration companyDetails attachments');

    // Format the response to match the frontend expectations
    const formattedRequests = requests.map(request => ({
      _id: request._id,
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      frameworkType: request.frameworkType,
      duration: request.duration,
      userDetails: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      companyDetails: request.companyDetails || {},
      attachments: request.attachments || []
    }));

    res.status(200).json({
      status: 'success',
      data: {
        requests: formattedRequests
      }
    });
  } catch (error) {
    console.error('Error in getRequestStatus:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching request status',
      error: error.message
    });
  }
};

export const getRequestById = catchAsync(async (req, res, next) => {
  // Get user details first
  const user = await User.findById(req.user.id).select('name email phone');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Fetch the request and include all fields (including approvals)
  const request = await Request.findOne({
    _id: req.params.id,
    userRef: req.user.id // Ensure the request belongs to the authenticated user
  });

  if (!request) {
    return next(new AppError('No request found with that ID', 404));
  }

  // Format the response to match the frontend expectations
  const formattedRequest = {
    _id: request._id,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    frameworkType: request.frameworkType,
    duration: request.duration,
    userDetails: {
      name: user.name,
      email: user.email,
      phone: user.phone
    },
    companyDetails: request.companyDetails || {},
    attachments: request.attachments || [],
    approvals: request.approvals || [] // <-- Include approvals in the response
  };

  res.status(200).json({
    status: 'success',
    data: {
      request: formattedRequest
    }
  });
});