import bcrypt from 'bcryptjs';

import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"]
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ["external", "internal"],
    default: "external"
  },
  department: String,
  company: {
    name: String,
    address: String,
    type: {
      type: String,
      enum: ["Government", "Private", "Non-Government", "Other"]
    }
  },
  isPasswordTemporary: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Only hash the password if it has been modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Add password verification method
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
