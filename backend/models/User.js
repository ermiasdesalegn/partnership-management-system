import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please enter your name"] 
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
    enum: ["external", "internal", "partnership-division", "law-department", "general-director"],
    default: "external"
  },
  company: {
    name: String,
    type: {
      type: String,
      enum: ["Government", "Private", "Non-Government", "Other"]
    },
    address: String,
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return validator.isMobilePhone(v, "any");
        },
        message: "Invalid phone number"
      }
    }
  },
  department: {
    type: String,
    required: function() {
      return this.role === "internal";
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;