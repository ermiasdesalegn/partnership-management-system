// controllers/userController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import Request from "../models/Request.js";
import catchAsync from "../utils/catchAsync.js";

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
    return next(new AppError('Invalid company details format', 400));
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