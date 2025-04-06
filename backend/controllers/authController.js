import User from "../models/User.js";
import AppError from "../utils/appError.js";
import { signToken } from "../utils/authHelpers.js";
import bcrypt from "bcryptjs";


export const createFirstAdmin = async (req, res, next) => {
  try {
    // Check if any admin exists
    const existingAdmin = await User.findOne({ 
      role: { $in: ["partnership-division", "general-director"] } 
    });

    if (existingAdmin) {
      return next(new AppError("Admin user already exists", 400));
    }
    const admin = await User.create({
      name: "System Admin",
      email: "admin@insa.com",
      password: "09090909",
      role: "general-director",
      department: "Administration"
    });

    admin.password = undefined;

    res.status(201).json({
      status: "success",
      data: { admin }
    });
  } catch (error) {
    next(new AppError("Error creating admin user", 500));
  }
};


// Modified register controller
export const registerUser = async (req, res, next) => {
  const { role, company, department } = req.body;

  // Prevent unauthorized admin registration
  if (["partnership-division", "general-director"].includes(role)) {
    return next(new AppError("Admin registration not allowed", 403));
  }

  // Existing validation
  if (role === "external" && !company) {
    return next(new AppError("Company details required for external users", 400));
  }
  
  if (role === "internal" && !department) {
    return next(new AppError("Department required for internal users", 400));
  }

  try {
    const newUser = await User.create({
      ...req.body,
      role: role || "external"
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser }
    });
  } catch (error) {
    next(new AppError("Registration failed", 400));
  }
};


export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    role: user.role
  });
};
