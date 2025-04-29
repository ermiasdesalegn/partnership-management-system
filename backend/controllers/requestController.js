import Request from "../models/Request.js";
import catchAsync from "../utils/catchAsync.js";
import Admin from "../models/Admin.js"; 
// import Request from "../models/Request.js";
import User from "../models/User.js";


export const createRequest = catchAsync(async (req, res, next) => {
  // Validate required fields
  if (!req.body.companyDetails || !req.body.frameworkType) {
    return next(new AppError('Missing required fields', 400));
  }

  // Parse company details
  const companyDetails = JSON.parse(req.body.companyDetails);

  // Create new request
  const newRequest = await Request.create({
    userRef: req.user.id,
    type: "external",
    status: "Pending",
    currentStage: "partnership-division",
    frameworkType: req.body.frameworkType,
    duration: req.body.duration,
    companyDetails: {
      ...companyDetails,
      // Ensure enum values match
      type: companyDetails.type in ["Government", "Private", "Non-Government", "Other"] 
        ? companyDetails.type 
        : "Other"
    },
    attachments: req.files.map(file => ({
      path: file.path.replace(/\\/g, '/'),
      originalName: file.originalname,
      uploadedBy: req.user.id,
      uploaderModel: 'User'
    }))
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
    // Clean up the uploaded file if request not found
    deleteFile(req.file.path);
    return next(new AppError('Request not found', 404));
  }

  const uploaderId = req.user?._id || req.admin?._id;
  const uploaderModel = req.user ? 'User' : 'Admin';

  request.attachments.push({
    path: req.file.path.replace(/\\/g, '/'),
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
    deleteFile(req.file.path);
    return next(new AppError('Request not found', 404));
  }

  const approval = request.approvals.id(req.params.approvalId);
  if (!approval) {
    deleteFile(req.file.path);
    return next(new AppError('Approval record not found', 404));
  }

  approval.attachments.push(req.file.path.replace(/\\/g, '/'));
  await request.save();

  res.status(200).json({
    status: 'success',
    data: {
      approval,
      attachmentPath: req.file.path.replace(/\\/g, '/')
    }
  });
});