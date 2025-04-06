// // Updated userController.js
// import catchAsync from "../utils/catchAsync.js";
// import User from "../models/User.js";
// import AppError from "../utils/appError.js";

// export const getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: "success",
//     results: users.length,
//     data: { users }
//   });
// });

// export const updateUserRole = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     { role: req.body.role },
//     { new: true, runValidators: true }
//   );

//   if (!user) return next(new AppError("User not found", 404));

//   res.status(200).json({
//     status: "success",
//     data: { user }
//   });
// });