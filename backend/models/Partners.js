import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema({
  requestRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyEmail: {
    type: String,
    required: true
  },
  companyType: {
    type: String,
    required: true
  },
  companyAddress: {
    type: String
  },
  frameworkType: {
    type: String,
    required: true
  },
  partnershipRequestType: {
    type: String,
    enum: ["strategic", "operational", "project", "tactical"],
    required: true
  },
  duration: {
    type: String
  },
  status: {
    type: String,
    default: "Active"
  },
  isSigned: {
    type: Boolean,
    default: false
  },
  signedAt: {
    type: Date
  },
  signedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  privileges: {
    type: Map,
    of: Boolean,
    default: () => new Map([
      ['director', true],
      ['partnership-division', true],
      ['law-service', false],
      ['law-research', false]
    ])
  },
  requestAttachments: [
    {
      path: String,
      originalName: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'requestAttachments.uploaderModel'
      },
      uploaderModel: String,
      description: String,
      uploadedAt: Date
    }
  ],
  approvalAttachments: [
    {
      path: String,
      originalName: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'approvalAttachments.uploaderModel'
      },
      uploaderModel: String,
      description: String,
      uploadedAt: Date
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Add any other fields you want to track for partners
});

export default mongoose.model("Partner", PartnerSchema);
