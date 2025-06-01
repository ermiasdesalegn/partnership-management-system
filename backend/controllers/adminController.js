import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Partners from "../models/Partners.js";

import jwt from "jsonwebtoken";
import { promisify } from "util";
import bcrypt from "bcryptjs";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { protectAdmin,restrictToAdmin } from "../middleware/authMiddleware.js";
// Generate token
const signToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ status: "fail", message: "Admin not found" });
    }
    
    res.status(200).json({
      status: "success",
      data: { admin }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
// Update current admin profile
export const updateMe = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { name, email, phone },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: "success",
      data: { admin }
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
// Update password
export const updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // 1) Get admin from collection
    const admin = await Admin.findById(req.admin.id).select("+password");
    
    // 2) Check if current password is correct
    if (!(await admin.correctPassword(currentPassword))) {
      return res.status(401).json({ status: "fail", message: "Your current password is wrong" });
    }
    
    // 3) If so, update password
    admin.password = newPassword;
    admin.passwordConfirm = confirmPassword;
    await admin.save();
    
    // 4) Log admin in, send JWT
    createSendToken(admin, 200, res);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "Please upload a file" });
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { profilePhoto: req.file.path },
      { new: true }
    );
    
    res.status(200).json({
      status: "success",
      data: { admin }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
// Upload cover photo
export const uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "Please upload a file" });
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { coverPhoto: req.file.path },
      { new: true }
    );
    
    res.status(200).json({
      status: "success",
      data: { admin }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
// Send token as cookie
const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);
  const cookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res.cookie("jwt", token, cookieOptions);
  admin.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { admin },
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide name, email and password"
      });
    }

    // Check if this is the first admin being created
    const adminCount = await Admin.countDocuments();
    
    let adminData = {
      name,
      email,
      password,
      department: department || "Administration"
    };

    // If this is the first admin, make them super-admin
    if (adminCount === 0) {
      adminData.role = "super-admin";
    } else {
      // For subsequent admins, require super-admin role and valid role
      if (!role || !["partnership-division", "law-department", "general-director", "super-admin"].includes(role)) {
        return res.status(400).json({
          status: "fail",
          message: "Please provide a valid role"
        });
      }
      adminData.role = role;
    }

    const newAdmin = await Admin.create(adminData);
    createSendToken(newAdmin, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists"
      });
    }
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};
// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Please provide email and password!");

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.correctPassword(password))) {
      throw new Error("Incorrect email or password");
    }

    admin.lastLogin = Date.now();
    await admin.save({ validateBeforeSave: false });

    createSendToken(admin, 200, res);
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};
// Logout
export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // expires immediately
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.status(200).json({ status: "success", message: "Logged out successfully" });
};
export const getAllAdmins = async (req, res) => {
  try {
    if (req.admin.role !== "general-director") {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }

    const admins = await Admin.find();
    res.status(200).json({
      status: "success",
      results: admins.length,
      data: { admins },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

  /**
   * Get all requests in the system
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  export const getAllRequests = async (req, res) => {
    try {
      const { type, department } = req.query;
      
      // Build the query
      let query = {};
      if (type) {
        query.type = type;
      }
      
      // Fetch requests with populated user information
      const requests = await Request.find(query)
        .populate({
          path: 'userRef',
          select: 'name email role department'
        })
        .sort({ createdAt: -1 });

      // Filter by department if specified
      let filteredRequests = requests;
      if (department) {
        filteredRequests = requests.filter(request => 
          request.userRef?.role === 'internal' && 
          request.userRef?.department === department
        );
      }

      res.status(200).json({
        success: true,
        count: filteredRequests.length,
        data: filteredRequests,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  };
 
  
  // Get all users (both internal and external)
 export const getAllUsers = async (req, res) => {
  try {
    console.log('Attempting to fetch users...'); // Debug log

    // Aggregate query to get users along with the number of requests and company name
    const users = await User.aggregate([
      {
        $lookup: {
          from: "requests", // Name of the collection in MongoDB (requests)
          localField: "_id", // Field to match in User collection
          foreignField: "userRef", // Field to match in Request collection
          as: "userRequests", // Alias for the joined requests
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          type: 1,
          companyName: 1, // Ensure this is projected
          requestCount: { $size: "$userRequests" }, // Count the number of requests for each user
        },
      },
    ]);

    console.log('Users found:', users.length); // Debug log
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error('Error in getAllUsers:', err); // Detailed error log
    res.status(500).json({
      success: false,
      error: err.message, // Send actual error message
    });
  }
};

  
  // Get all internal users
  export const getAllInternalUsers = async (req, res) => {
    try {
      const users = await User.aggregate([
        { $match: { role: "internal" } },
        {
          $lookup: {
            from: "requests",
            localField: "_id",
            foreignField: "userRef",
            as: "userRequests"
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            department: 1,
            role: 1,
            requestCount: { $size: "$userRequests" }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  };
  
  // Get all external users
  export const getAllExternalUsers = async (req, res) => {
    try {
      const users = await User.aggregate([
        { $match: { role: "external" } },
        {
          $lookup: {
            from: "requests",
            localField: "_id",
            foreignField: "userRef",
            as: "userRequests"
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            company: 1,
            role: 1,
            requestCount: { $size: "$userRequests" }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  };
  
  export const getRequestsByRole = catchAsync(async (req, res, next) => {
    const role = req.admin.role;
    console.log("Admin Role:", req.admin.role);    
    if (!["partnership-division", "law-service", "law-research", "director", "general-director"].includes(role)) {
      return next(new AppError("Invalid role for request access", 403));
    }
    let requests;
    switch (role) {
      case "partnership-division":
        requests = await Request.find({ currentStage: "partnership-division" }).populate("userRef");
        break;
      case "law-service":
        requests = await Request.find({ 
          currentStage: "law-service",
          isLawServiceRelated: true
        }).populate("userRef");
        break;
      case "law-research":
        requests = await Request.find({ 
          currentStage: "law-research",
          isLawResearchRelated: true
        }).populate("userRef");
        break;
      case "director":
      case "general-director":
        requests = await Request.find().populate("userRef");
        break;
      default:
        return next(new AppError("Role not found", 403));
    }
  
    if (!requests || requests.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: `No requests found for the ${role}`,
      });
    }
  
    res.status(200).json({
      status: "success",
      message: `${role} requests retrieved successfully`,
      data: requests,
    });
  });
  
  export const getSingleRequestInRoleList = catchAsync(async (req, res, next) => {
    const adminRole = req.admin.role;
    const requestId = req.params.id;
  
    // Check if admin has permission to access this endpoint
    if (!["partnership-division", "director", "general-director", "law-service", "law-research"].includes(adminRole)) {
      return next(new AppError("You don't have permission to access this request", 403));
    }
  
    // Fetch the request with populated user and admin details
    const request = await Request.findById(requestId)
      .populate("userRef")
      .populate({
        path: "approvals.approvedBy",
        select: "name email role"
      });
  
    if (!request) {
      return next(new AppError("Request not found", 404));
    }
  
    // Additional role-based access control
    if (adminRole === "law-service" && request.currentStage !== "law-service") {
      return next(new AppError("You can only view requests in the law-service stage", 403));
    }

    if (adminRole === "law-research" && request.currentStage !== "law-research") {
      return next(new AppError("You can only view requests in the law-research stage", 403));
    }
  
    // Transform file paths to be relative to uploads directory
    if (request.attachments) {
      request.attachments = request.attachments.map(attachment => ({
        ...attachment.toObject(),
        path: attachment.path.split('uploads/').pop()
      }));
    }

    if (request.approvals) {
      request.approvals = request.approvals.map(approval => ({
        ...approval.toObject(),
        attachments: approval.attachments?.map(file => file.split('uploads/').pop())
      }));
    }
  
    res.status(200).json({
      status: "success",
      data: request,
    });
  });

  // Get requests for a specific internal user
  export const getInternalUserRequests = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Check user exists and is internal
      const user = await User.findOne({ _id: userId, type: "internal" });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Internal user not found",
        });
      }
  
      const requests = await Request.find({ userRef: userId });
      res.status(200).json({
        success: true,
        count: requests.length,
        data: requests,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  };
  
  // Get requests for a specific external user
  export const getExternalUserRequests = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Check user exists and is external
      const user = await User.findOne({ _id: userId, type: "external" });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "External user not found",
        });
      }
  
      const requests = await Request.find({ userRef: userId });
      res.status(200).json({
        success: true,
        count: requests.length,
        data: requests,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  };




  export const getReviewedRequestsByAdmin = async (req, res) => {
    try {
      const adminId = req.admin._id;
      const adminRole = req.admin.role;
  
      // Build query based on admin role
      let query = {
        approvals: {
          $elemMatch: {
            approvedBy: adminId,
            decision: { $in: ['approve', 'disapprove'] }
          }
        }
      };

      // Add role-specific filters
      if (adminRole === 'law-service') {
        query.$or = [
          { 'approvals.stage': 'law-service' },
          { isLawServiceRelated: true }
        ];
      } else if (adminRole === 'law-research') {
        query.$or = [
          { 'approvals.stage': 'law-research' },
          { isLawResearchRelated: true }
        ];
      } else if (adminRole === 'partnership-division') {
        query['approvals.stage'] = 'partnership-division';
      }

      const reviewedRequests = await Request.find(query)
        .populate("userRef", "name email")
        .populate("approvals.approvedBy", "name role")
        .select("-__v");
  
      res.status(200).json({
        status: "success",
        results: reviewedRequests.length,
        data: reviewedRequests,
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  };
  
  export const getReviewedRequestById = async (req, res) => {
    try {
      const adminId = req.admin._id;
      const requestId = req.params.id;

      // Find the request that was reviewed by this admin
      const request = await Request.findOne({
        _id: requestId,
        approvals: {
          $elemMatch: {
            approvedBy: adminId,
            decision: { $in: ['approve', 'disapprove'] }
          }
        }
      })
      .populate("userRef", "name email")
      .populate("approvals.approvedBy", "name role")
      .select("-__v");

      if (!request) {
        return res.status(404).json({
          status: "fail",
          message: "Request not found or you haven't reviewed this request"
        });
      }

      res.status(200).json({
        status: "success",
        data: request
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  };
  
export const getDashboardStatistics = async (req, res) => {
  try {
    console.log("Fetching dashboard statistics...");
    
    // Get total partnerships (signed + unsigned)
    const totalPartners = await Partners.countDocuments();
    const signedPartners = await Partners.countDocuments({ isSigned: true });
    const unsignedPartners = await Partners.countDocuments({ isSigned: false });

    // Get active partners (partners with status "Active")
    const activePartners = await Partners.countDocuments({ status: "Active" });

    // Get total requests
    const totalRequests = await Request.countDocuments();

    // Get new requests in the last year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const newRequestsLastYear = await Request.countDocuments({
      createdAt: { $gte: oneYearAgo }
    });

    console.log("Basic statistics:", {
      totalPartners,
      signedPartners,
      unsignedPartners,
      activePartners,
      totalRequests,
      newRequestsLastYear
    });

    // Get monthly statistics for the last year
    const monthlyStats = await Request.aggregate([
      {
        $match: {
          createdAt: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Get monthly partner statistics
    const monthlyPartnerStats = await Partners.aggregate([
      {
        $match: {
          createdAt: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          signed: {
            $sum: { $cond: [{ $eq: ["$isSigned", true] }, 1, 0] }
          },
          unsigned: {
            $sum: { $cond: [{ $eq: ["$isSigned", false] }, 1, 0] }
          },
          active: {
            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    console.log("Monthly stats:", { monthlyStats, monthlyPartnerStats });

    // Format monthly data for charts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyStats = months.map((month, index) => {
      const monthData = monthlyStats.find(m => m._id.month === index + 1);
      const partnerData = monthlyPartnerStats.find(m => m._id.month === index + 1);
      return {
        month,
        requests: monthData ? monthData.count : 0,
        signedPartners: partnerData ? partnerData.signed : 0,
        unsignedPartners: partnerData ? partnerData.unsigned : 0,
        activePartners: partnerData ? partnerData.active : 0
      };
    });

    console.log("Formatted monthly stats:", formattedMonthlyStats);

    res.status(200).json({
      status: "success",
      data: {
        statistics: {
          totalPartners,
          signedPartners,
          unsignedPartners,
          activePartners,
          totalRequests,
          newRequestsLastYear
        },
        monthlyStats: formattedMonthlyStats
      }
    });
  } catch (err) {
    console.error("Error in getDashboardStatistics:", err);
    res.status(500).json({ status: "error", message: err.message });
    }
  };
  
