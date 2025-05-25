import PartnershipActivity from "../models/PartnershipActivity.js";
import Partner from "../models/Partners.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Create a new activity
export const createActivity = catchAsync(async (req, res, next) => {
  const { title, description, assignedTo } = req.body;
  const { partnerId } = req.params;

  // Check if partner exists and is signed
  const partner = await Partner.findById(partnerId).populate('requestRef');
  if (!partner) {
    return next(new AppError("Partner not found", 404));
  }
  if (!partner.isSigned) {
    return next(new AppError("Cannot create activities for unsigned partners", 400));
  }

  // Calculate deadline based on partner's signed date and duration
  const signedDate = new Date(partner.signedAt);
  const endDate = new Date(signedDate);
  
  const duration = partner.requestRef.duration;
  if (!duration) {
    return next(new AppError("Partner duration not found", 400));
  }

  // Handle both object and number duration formats
  if (typeof duration === 'object' && duration.type) {
    if (duration.type === "months") {
      endDate.setMonth(endDate.getMonth() + parseInt(duration.value));
    } else {
      endDate.setFullYear(endDate.getFullYear() + parseInt(duration.value));
    }
  } else {
    // If duration is a number, assume it's years
    endDate.setFullYear(endDate.getFullYear() + parseInt(duration));
  }

  const activity = await PartnershipActivity.create({
    partnerRef: partnerId,
    title,
    description,
    assignedTo,
    deadline: endDate,
    createdBy: req.admin._id
  });

  res.status(201).json({
    status: "success",
    data: activity
  });
});

// Get all activities for a partner
export const getPartnerActivities = catchAsync(async (req, res, next) => {
  const { partnerId } = req.params;
  const { status } = req.query;

  const query = { partnerRef: partnerId };
  if (status) {
    query.status = status;
  }

  const activities = await PartnershipActivity.find(query)
    .populate("createdBy", "name email")
    .sort({ deadline: 1 });

  res.status(200).json({
    status: "success",
    results: activities.length,
    data: activities
  });
});

// Update activity status
export const updateActivityStatus = catchAsync(async (req, res, next) => {
  const { activityId } = req.params;
  const { status } = req.body;

  const activity = await PartnershipActivity.findById(activityId);
  if (!activity) {
    return next(new AppError("Activity not found", 404));
  }

  activity.status = status;
  if (status === "completed") {
    activity.completedAt = Date.now();
  }

  await activity.save();

  res.status(200).json({
    status: "success",
    data: activity
  });
});

// Add attachment to activity
export const addActivityAttachment = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload a file", 400));
  }

  const { activityId } = req.params;
  const activity = await PartnershipActivity.findById(activityId);
  if (!activity) {
    return next(new AppError("Activity not found", 404));
  }

  activity.attachments.push({
    path: req.file.filename,
    originalName: req.file.originalname,
    uploadedBy: req.admin._id,
    uploaderModel: "Admin",
    description: req.body.description,
    uploadedAt: Date.now()
  });

  await activity.save();

  res.status(200).json({
    status: "success",
    data: activity
  });
});

// Remove attachment from activity
export const removeActivityAttachment = catchAsync(async (req, res, next) => {
  const { activityId, attachmentId } = req.params;

  const activity = await PartnershipActivity.findById(activityId);
  if (!activity) {
    return next(new AppError("Activity not found", 404));
  }

  activity.attachments = activity.attachments.filter(
    attachment => attachment._id.toString() !== attachmentId
  );

  await activity.save();

  res.status(200).json({
    status: "success",
    data: activity
  });
});

// Get activity statistics for a partner
export const getActivityStatistics = catchAsync(async (req, res, next) => {
  const { partnerId } = req.params;

  const activities = await PartnershipActivity.find({ partnerRef: partnerId });
  
  const stats = {
    total: activities.length,
    pending: activities.filter(a => a.status === "pending").length,
    in_progress: activities.filter(a => a.status === "in_progress").length,
    completed: activities.filter(a => a.status === "completed").length,
    upcomingDeadlines: activities
      .filter(a => a.status !== "completed" && new Date(a.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5)
  };

  res.status(200).json({
    status: "success",
    data: stats
  });
});

// Delete activity
export const deleteActivity = catchAsync(async (req, res, next) => {
  const { activityId } = req.params;

  const activity = await PartnershipActivity.findById(activityId);
  if (!activity) {
    return next(new AppError("Activity not found", 404));
  }

  await PartnershipActivity.findByIdAndDelete(activityId);

  res.status(200).json({
    status: "success",
    message: "Activity deleted successfully"
  });
}); 