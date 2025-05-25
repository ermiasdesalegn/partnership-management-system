import Request from "../models/Request.js";
import catchAsync from "../utils/catchAsync.js";
import Admin from "../models/Admin.js"; 
// import Request from "../models/Request.js";
import User from "../models/User.js";
import AppError from '../utils/appError.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../public/uploads');

// Utility function to delete file
const deleteFile = (filePath) => {
  try {
    // Handle both full paths and just filenames
    const fullPath = filePath.includes(path.sep) 
      ? filePath 
      : path.join(uploadsDir, filePath);
      
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error(`Error deleting file ${filePath}:`, err);
  }
};

export const createRequest = catchAsync(async (req, res, next) => {
  // Validate required fields
  if (!req.body.companyDetails) {
    return next(new AppError('Missing required fields', 400));
  }

  // Parse company details and duration
  const companyDetails = JSON.parse(req.body.companyDetails);
  let duration;
  try {
    duration = JSON.parse(req.body.duration);
  } catch (error) {
    return next(new AppError('Invalid duration format', 400));
  }

  // Validate duration
  if (!duration || !duration.value || !duration.type || !['months', 'years'].includes(duration.type)) {
    return next(new AppError('Invalid duration format. Must include value and type (months/years)', 400));
  }

  // Get user's role from the authenticated user
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Create new request with files - using just the filename, not full path
  const newRequest = await Request.create({
    userRef: req.user.id,
    type: user.role === 'internal' ? 'internal' : 'external', // Set type based on user's role
    status: "pending", // Changed from "Pending" to "pending"
    currentStage: "partnership-division",
    companyDetails: {
      ...companyDetails,
      // Ensure enum values match
      type: companyDetails.type in ["Government", "Private", "Non-Government", "Other"] 
        ? companyDetails.type 
        : "Other"
    },
    duration: {
      value: duration.value,
      type: duration.type
    },
    attachments: req.files ? req.files.map(file => ({
      path: file.filename, // Just store the filename
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

export const reviewRequest = catchAsync(async (req, res, next) => {
  const request = await Request.findById(req.params.id);
  if (!request) return next(new AppError("Request not found", 404));
  if (request.status !== "pending") return next(new AppError("Can only review pending requests", 400));

  request.status = "in review";
  request.reviewedBy = req.admin._id;

  // Forward to law department if law-related
  if (request.isLawRelated) {
    request.forwardedToLaw = true;
  }

  await request.save();
  res.status(200).json({ status: "success", data: { request } });
});

export const addRequestAttachment = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  const request = await Request.findById(req.params.requestId);
  if (!request) {
    // Clean up the uploaded file if it exists
    if (req.file) {
      deleteFile(req.file.path);
    }
    return next(new AppError('Request not found', 404));
  }

  const uploaderId = req.user?._id || req.admin?._id;
  const uploaderModel = req.user ? 'User' : 'Admin';

  // Store just the filename in the database
  const filename = req.file.filename;
  
  request.attachments.push({
    path: filename, // Just store the filename
    originalName: req.file.originalname,
    uploadedBy: uploaderId,
    uploaderModel,
    description: req.body.description || ''
  });

  await request.save();

  res.status(200).json({
    status: 'success',
    data: {
      attachment: request.attachments[request.attachments.length - 1],
      requestId: request._id
    }
  });
});

export const addFeedbackAttachment = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  const request = await Request.findById(req.params.requestId);
  if (!request) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    return next(new AppError('Request not found', 404));
  }

  const approval = request.approvals.id(req.params.approvalId);
  if (!approval) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    return next(new AppError('Approval record not found', 404));
  }

  // Store just the filename
  const filename = req.file.filename;
  
  approval.attachments.push(filename);
  await request.save();

  res.status(200).json({
    status: 'success',
    data: {
      approval,
      attachmentPath: filename
    }
  });
});

export const getRequestById = catchAsync(async (req, res, next) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return next(new AppError('No request found with that ID', 404));
  }

  // Check if the request belongs to the authenticated user
  if (request.userRef.toString() !== req.user.id) {
    return next(new AppError('You are not authorized to view this request', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      request
    }
  });
});