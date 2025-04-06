import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["partnership-division", "law-department", "general-director"],
    required: true,
  },
  department: {
    type: String,
    required: function () {
      return this.role === "law-department";
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

AdminSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

AdminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    return JWTTimestamp < parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  }
  return false;
};

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
