// import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/appError.js";
// import Support, { validateSupportRequest } from "../models/Support.js";

// // Create a new Support Request
// export const createSupportRequest = catchAsync(async (req, res, next) => {
//   const { error } = validateSupportRequest(req.body);
//   if (error) return next(new AppError(error.details[0].message, 400));

//   const request = new Support(req.body);
//   await request.save();

//   res.status(201).json({
//     status: "success",
//     data: {
//       request,
//     },
//   });
// });

// // Get all Support Requests
// export const getAllSupportRequests = catchAsync(async (req, res) => {
//   const requests = await Support.find();

//   res.status(200).json({
//     status: "success",
//     data: {
//       requests,
//     },
//   });
// });

// // Get a Support Request by ID
// export const getSupportRequest = catchAsync(async (req, res, next) => {
//   const request = await Support.findById(req.params.id);

//   if (!request) {
//     return next(new AppError("No request found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       request,
//     },
//   });
// });

// // Update a Support Request by ID
// export const updateSupportRequest = catchAsync(async (req, res, next) => {
//   const request = await Support.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!request) {
//     return next(new AppError("No request found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       request,
//     },
//   });
// });

// // Delete a Support Request by ID
// export const deleteSupportRequest = catchAsync(async (req, res, next) => {
//   const request = await Support.findByIdAndDelete(req.params.id);

//   if (!request) {
//     return next(new AppError("No request found with that ID", 404));
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });
