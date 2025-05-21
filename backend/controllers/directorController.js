import Request from "../models/Request.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Get requests that need director review
export const getDirectorRequests = catchAsync(async (req, res, next) => {
  const requests = await Request.find({
    forDirector: true,
    currentStage: "director"
  }).populate("userRef")
    .populate({
      path: "approvals.approvedBy",
      select: "name email role"
    });

  res.status(200).json({
    status: "success",
    data: requests
  });
});

// Get all requests (view only)
export const getAllRequests = catchAsync(async (req, res, next) => {
  const requests = await Request.find()
    .populate("userRef")
    .populate({
      path: "approvals.approvedBy",
      select: "name email role"
    });

  res.status(200).json({
    status: "success",
    data: requests
  });
});

// Director review decision
export const directorReview = catchAsync(async (req, res, next) => {
  const { requestId, decision, message, feedbackMessage } = req.body;

  const request = await Request.findById(requestId);
  
  if (!request) {
    return next(new AppError("Request not found", 404));
  }

  if (!request.forDirector || request.currentStage !== "director") {
    return next(new AppError("This request is not for director review", 403));
  }

  // Record decision
  const approval = {
    stage: "director",
    approvedBy: req.admin._id,
    decision,
    message,
    feedbackMessage,
    attachments: req.files?.attachments?.map(f => f.path) || [],
    feedbackAttachments: req.files?.feedbackAttachments?.map(f => f.path) || [],
    date: new Date()
  };

  request.approvals.push(approval);

  if (decision === "approve") {
    request.currentStage = "general-director";
  } else {
    request.status = "Disapproved";
  }

  await request.save();

  res.status(200).json({
    status: "success",
    data: request
  });
}); 