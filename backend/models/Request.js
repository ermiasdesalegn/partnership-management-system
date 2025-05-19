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
  currentStage: {
    type: String,
    enum: ["partnership-division", "law-department", "general-director"],
    default: "partnership-division"
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
  // In Request model
companyDetails: {
  name: { type: String, required: [true, 'Company name is required'] },
  address: String,
  type: {
    type: String,
    enum: ["Government", "Private", "Non-Government", "Other"],
    required: [true, 'Company type is required']
  },
    email: {
    type: String,
    validate: {
      validator: (v) => /\S+@\S+\.\S+/.test(v),
      message: 'Invalid email format'
    }
  },
  phone: String
},
  lawRelated: {
    type: Boolean,
    default: function() {
      // For external requests, always false
      // For internal requests, will be set during partnership division review
      return this.type === 'internal' ? false : false;
    }
  },
  attachments: [
    {
      path: String,
      originalName: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'attachments.uploaderModel'
      },
      uploaderModel: {
        type: String,
        enum: ['User', 'Admin']
      },
      description: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  approvals: [
    {
      stage: String,
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      decision: String,
      message: String,
      attachments: [String],
      feedbackMessage: String,
      feedbackAttachments: [String],
      date: { type: Date, default: Date.now },
    },
  ],
  department: String,
  companyStatus: {
    type: String,
    enum: ["Draft", "Email Sent", "Reviewed", "Approved", "Rejected"]
  },
  duration: String
});

export default mongoose.model("Request", RequestSchema);
