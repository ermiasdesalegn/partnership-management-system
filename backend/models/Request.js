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
//   partnershipType: {
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


import mongoose from "mongoose";
import Joi from "joi";

const PartnershipSchema = new mongoose.Schema({
  // Common Fields
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["internal", "external"], required: true },
  status: { 
    type: String, 
    enum: ["Draft", "Submitted", "In-Review", "Approved", "Rejected"],
    default: "Draft"
  },
  partnershipLevel: {
    type: String,
    enum: ["Strategic", "Tactical", "Operational", "Project"]
  },
  frameworkType: {
    type: String,
    enum: ["MOU", "NDA", "MOA", "Contract", "Other"]
  },
  createdAt: { type: Date, default: Date.now },

  // External Partner Specific
  companyDetails: {
    name: String,
    type: { type: String, enum: ["Government", "Private", "Non-Government", "Other"] },
    email: String,
    phone: String,
    address: String,
    registrationDoc: String // File path
  },

  // Internal Partner Specific
  internalRequest: {
    purpose: String,
    partnerName: String,
    partnerEmail: String,
    partnerPhone: String,
    partnerAddress: String,
    cooperationArea: {
      type: String,
      enum: [
        "Cybersecurity Research & Development",
        "Cybersecurity Products & Services",
        "Cybersecurity Capacity Building",
        "Policy & Legal Framework",
        "Standards Development",
        "Other"
      ]
    }
  },

  // Framework Details (Common)
  frameworkDetails: {
    objective: String,
    areas: {
      insa: [String],
      partner: [String]
    },
    effectiveDate: Date,
    duration: String,
    terminationClauses: String,
    correspondence: {
      name: String,
      phone: String,
      email: String
    },
    status: {
      type: String,
      enum: ["Draft", "Approved", "Implemented", "Not Implemented"]
    }
  }
});

// Validation schemas
const externalRequestSchema = Joi.object({
  type: Joi.string().valid("external").required(), // 👈 Add this
  companyDetails: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid("Government", "Private", "Non-Government", "Other").required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^9\d{8}$/).required(),
    address: Joi.string().required(),
    registrationDoc: Joi.string().required()
  }).required(),
  partnershipLevel: Joi.string().valid("Strategic", "Tactical", "Operational", "Project").required(),
  frameworkType: Joi.string().valid("MOU", "NDA", "MOA", "Contract", "Other").required(),
  frameworkDetails: Joi.object({
    objective: Joi.string().required(),
    areas: Joi.object({
      insa: Joi.array().items(Joi.string()).min(1).required(), // 👈 Add .required()
      partner: Joi.array().items(Joi.string()).min(1).required()
    }).required(),
    effectiveDate: Joi.date().required(),
    duration: Joi.string().required(),
    terminationClauses: Joi.string().required(),
    correspondence: Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email().required()
    }).required()
  }).required()
});

const internalRequestSchema = Joi.object({
  type: Joi.string().valid("internal").required(), // 👈 Add this
  internalRequest: Joi.object({
    purpose: Joi.string().required(),
    partnerName: Joi.string().required(),
    partnerEmail: Joi.string().email().required(),
    partnerPhone: Joi.string().pattern(/^9\d{8}$/).required(),
    partnerAddress: Joi.string().required(),
    cooperationArea: Joi.string().valid(
      "Cybersecurity Research & Development",
      "Cybersecurity Products & Services",
      "Cybersecurity Capacity Building",
      "Policy & Legal Framework",
      "Standards Development",
      "Other"
    )
  }).required(),
  frameworkType: Joi.string().valid("MOU", "NDA", "MOA", "Contract", "Other").required(),
  partnershipLevel: Joi.string().valid("Strategic", "Tactical", "Operational", "Project").required()
});



const Request = mongoose.model("Request", PartnershipSchema);

export { Request, externalRequestSchema, internalRequestSchema };