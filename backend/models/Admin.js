import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ["partnership-division", "law-department", "general-director", "super-admin"],
    required: true
  },
  department: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPasswordTemporary: {
    type: Boolean,
    default: false
  },
  lastLoggedIn: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

AdminSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Admin", AdminSchema);
