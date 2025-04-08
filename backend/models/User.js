// // models/User.js
// import mongoose from "mongoose";
// import validator from "validator";
// import bcrypt from "bcryptjs";

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter your name"]
//   },
//   email: {
//     type: String,
//     required: [true, "Please enter your email"],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, "Please provide a valid email"]
//   },
//   password: {
//     type: String,
//     required: [true, "Please enter your password"],
//     minlength: 8,
//     select: false
//   },
//   role: {
//     type: String,
//     enum: ["external", "internal"],
//     default: "external"
//   },
//   company: {
//     name: String,
//     type: {
//       type: String,
//       enum: ["Government", "Private", "Non-Government", "Other"]
//     },
//     address: String,
//     phone: {
//       type: String,
//       validate: {
//         validator: v => validator.isMobilePhone(v, "any"),
//         message: "Invalid phone number"
//       }
//     }
//   },
//   department: {
//     type: String,
//     required: function () {
//       return this.role === "internal";
//     }
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// UserSchema.methods.correctPassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.model("User", UserSchema);
















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

const User = mongoose.model("User", userSchema);
export default User;
