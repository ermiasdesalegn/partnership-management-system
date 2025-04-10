import Request from "../models/Request.js";

import Admin from "../models/Admin.js"; 

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

