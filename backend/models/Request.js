// import mongoose from "mongoose";
// import Joi from "joi";

// const RequestSchema = new mongoose.Schema({
//   companyName: { type: String, required: true },
//   companyType: {
//     type: String,
//     enum: ["Government", "Private", "NGO", "Educational"],
//     required: true,
//   },
//   address: { type: String, required: true },
//   areaOfCooperation: { type: String, required: true },
//   partnershipType: {Zdex3es443w
//     type: String,
//     enum: ["Project", "Operational", "Strategic"],
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["Pending", "in-review", "Approved", "Rejected"],
//     default: "Pending",
//   },
//   createdAt: { type: Date, default: Date.now },
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", // Reference to the User model
//     required: true, // Ensures each request is linked to a user
//   },
// });

// const validateRequest = (request) => {
//   const schema = Joi.object({
//     companyName: Joi.string().min(3).required(),
//     companyType: Joi.string()
//       .valid("Government", "Private", "NGO", "Educational")
//       .required(),
//     address: Joi.string().min(5).required(),
//     areaOfCooperation: Joi.string().min(3).required(),
//     partnershipType: Joi.string()
//       .valid("Project", "Operational", "Strategic")
//       .required(),
//   });

//   return schema.validate(request);
// };

// const Request = mongoose.model("Request", RequestSchema);

// export { Request, validateRequest };


// models/Request.js








import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["internal", "external"],
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "In Review", "Approved", "Disapproved"],
    default: "Pending"
  },
  frameworkType: {
    type: String,
    enum: ["MOU", "MOA", "Contract", "Other"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastReviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  companyDetails: {
    name: String,
    address: String,
    type: {
      type: String,
      enum: ["Government", "Private", "Non-Government", "Other"]
    }
  },
  lawRelated: {
    type: Boolean,
    default: false
  },
  department: String,
  companyStatus: {
    type: String,
    enum: ["Draft", "Email Sent", "Reviewed", "Approved", "Rejected"]
  },
  duration: String // optional duration field from your notes
});

export default mongoose.model("Request", RequestSchema);
