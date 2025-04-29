
import bcrypt from 'bcrypt';

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
    enum: ["external", "internal", "partnership-division", "general-director"],
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Add password verification method
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
