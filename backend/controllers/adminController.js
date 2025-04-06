import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import bcrypt from "bcryptjs";

// Generate token
const signToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

// Send token as cookie
const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);
  const cookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);
  admin.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { admin },
  });
};

// Middleware: Protect route
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt || (req.headers.authorization?.startsWith("Bearer") && req.headers.authorization.split(" ")[1]);
    if (!token) throw new Error("You are not logged in");

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentAdmin = await Admin.findById(decoded.id);
    if (!currentAdmin) throw new Error("Admin no longer exists");

    if (currentAdmin.changedPasswordAfter(decoded.iat)) {
      throw new Error("Password changed recently. Please login again.");
    }

    req.admin = currentAdmin;
    next();
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};
export const restrictTo = (...roles) => {
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

// Signup (Only by general-director)
export const signup = async (req, res) => {
  try {
    if (req.admin?.role !== "general-director") {
      return res.status(403).json({
        status: "fail",
        message: "Only general director can create new admins",
      });
    }

    const newAdmin = await Admin.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      department: req.body.department,
    });

    createSendToken(newAdmin, 201, res);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Please provide email and password!");

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.correctPassword(password))) {
      throw new Error("Incorrect email or password");
    }

    admin.lastLogin = Date.now();
    await admin.save({ validateBeforeSave: false });

    createSendToken(admin, 200, res);
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};

// Get all admins (only general-director)
export const getAllAdmins = async (req, res) => {
  try {
    if (req.admin.role !== "general-director") {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }

    const admins = await Admin.find();
    res.status(200).json({
      status: "success",
      results: admins.length,
      data: { admins },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Send to law department (partnership-division only)
export const sendToLawDepartment = async (req, res) => {
  try {
    if (req.admin.role !== "partnership-division") {
      return res.status(403).json({ status: "fail", message: "Not allowed" });
    }

    const request = {
      from: req.admin._id,
      to: req.body.lawDepartmentAdminId,
      content: req.body.content,
      status: "pending",
    };

    res.status(200).json({
      status: "success",
      message: "Request sent to law department",
      data: { request },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Review request (law-department only)
export const reviewRequest = async (req, res) => {
  try {
    if (req.admin.role !== "law-department") {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }

    const request = {
      id: req.params.requestId,
      reviewedBy: req.admin._id,
      decision: req.body.decision,
      comments: req.body.comments,
    };

    res.status(200).json({
      status: "success",
      message: "Request reviewed successfully",
      data: { request },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
