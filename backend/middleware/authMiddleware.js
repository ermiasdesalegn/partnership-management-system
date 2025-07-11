import catchAsync from "../utils/catchAsync.js"; // Add this import
import jwt from "jsonwebtoken";
import { promisify } from "util";
// import User from "../models/User.js";
import AppError from "../utils/appError.js";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

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

// Middleware: Protect route
export const protectAdmin = async (req, res, next) => {
  try {
    let token = req.cookies.jwt || (req.headers.authorization?.startsWith("Bearer") && req.headers.authorization.split(" ")[1]);
    if (!token) throw new Error("You are not logged in");

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentAdmin = await Admin.findById(decoded.id);
    if (!currentAdmin) throw new Error("Admin no longer exists");

   

    req.admin = currentAdmin;
    next();
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};


export const restrictToAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};