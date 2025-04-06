import catchAsync from "../utils/catchAsync.js"; // Add this import
import jwt from "jsonwebtoken";
import { promisify } from "util";
// import User from "../models/User.js";
import AppError from "../utils/appError.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;
  
  // 1. Get token
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token received:", token); // Debug log
  }

  if (!token) {
    console.log("No token found");
    return next(new AppError("Authentication required", 401));
  }

  // 2. Verify token
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // Fixed typo
    console.log("Decoded token:", decoded);
    
    // 3. Check user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.log("User not found for ID:", decoded.id);
      return next(new AppError("User no longer exists", 401));
    }

    // 4. Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return next(new AppError("Invalid token", 401));
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Unauthorized access", 403));
    }
    next();
  };
};