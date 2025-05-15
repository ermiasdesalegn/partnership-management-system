import Partner from "../models/Partners.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Create a new partner
export const createPartner = catchAsync(async (req, res, next) => {
  const { companyName, companyEmail, companyType, companyAddress, frameworkType, duration } = req.body;

  const partner = await Partner.create({
    companyName,
    companyEmail,
    companyType,
    companyAddress,
    frameworkType,
    duration,
    requestRef: req.body.requestRef
  });

  res.status(201).json({
    status: "success",
    data: partner
  });
});

// Get all partners
export const getAllPartners = catchAsync(async (req, res, next) => {
  const partners = await Partner.find()
    .populate("requestRef")
    .populate("requestAttachments.uploadedBy")
    .populate("approvalAttachments.uploadedBy");

  res.status(200).json({
    status: "success",
    results: partners.length,
    data: partners
  });
});

// Get a single partner
export const getPartner = catchAsync(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id)
    .populate("requestRef")
    .populate("requestAttachments.uploadedBy")
    .populate("approvalAttachments.uploadedBy");

  if (!partner) {
    return next(new AppError("No partner found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: partner
  });
});

// Update a partner
export const updatePartner = catchAsync(async (req, res, next) => {
  const { companyName, companyEmail, companyType, companyAddress, frameworkType, duration, status } = req.body;

  const partner = await Partner.findByIdAndUpdate(
    req.params.id,
    { companyName, companyEmail, companyType, companyAddress, frameworkType, duration, status },
    { new: true, runValidators: true }
  ).populate("requestRef")
   .populate("requestAttachments.uploadedBy")
   .populate("approvalAttachments.uploadedBy");

  if (!partner) {
    return next(new AppError("No partner found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: partner
  });
});

// Delete a partner
export const deletePartner = catchAsync(async (req, res, next) => {
  const partner = await Partner.findByIdAndDelete(req.params.id);

  if (!partner) {
    return next(new AppError("No partner found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});

// Add a request attachment
export const addRequestAttachment = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload a file", 400));
  }

  const partner = await Partner.findById(req.params.id);
  if (!partner) {
    return next(new AppError("No partner found with that ID", 404));
  }

  partner.requestAttachments.push({
    path: req.file.filename,
    originalName: req.file.originalname,
    uploadedBy: req.admin._id,
    uploaderModel: "Admin",
    description: req.body.description,
    uploadedAt: Date.now()
  });

  await partner.save();

  res.status(200).json({
    status: "success",
    data: partner
  });
});

// Add an approval attachment
export const addApprovalAttachment = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload a file", 400));
  }

  const partner = await Partner.findById(req.params.id);
  if (!partner) {
    return next(new AppError("No partner found with that ID", 404));
  }

  partner.approvalAttachments.push({
    path: req.file.filename,
    originalName: req.file.originalname,
    uploadedBy: req.admin._id,
    uploaderModel: "Admin",
    description: req.body.description,
    uploadedAt: Date.now()
  });

  await partner.save();

  res.status(200).json({
    status: "success",
    data: partner
  });
});

// Remove a request attachment
export const removeRequestAttachment = catchAsync(async (req, res, next) => {
  const { attachmentId } = req.params;

  const partner = await Partner.findById(req.params.id);
  if (!partner) {
    return next(new AppError("No partner found with that ID", 404));
  }

  partner.requestAttachments = partner.requestAttachments.filter(
    attachment => attachment._id.toString() !== attachmentId
  );

  await partner.save();

  res.status(200).json({
    status: "success",
    data: partner
  });
});

// Remove an approval attachment
export const removeApprovalAttachment = catchAsync(async (req, res, next) => {
  const { attachmentId } = req.params;

  const partner = await Partner.findById(req.params.id);
  if (!partner) {
    return next(new AppError("No partner found with that ID", 404));
  }

  partner.approvalAttachments = partner.approvalAttachments.filter(
    attachment => attachment._id.toString() !== attachmentId
  );

  await partner.save();

  res.status(200).json({
    status: "success",
    data: partner
  });
}); 