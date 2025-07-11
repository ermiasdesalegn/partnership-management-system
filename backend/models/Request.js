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
    enum: ['pending', 'approved', 'disapproved', 'In Review'],
    default: 'pending',
    required: true,
  },
  currentStage: {
    type: String,
    enum: ["partnership-division", "law-service", "law-research", "general-director", "director"],
    default: "partnership-division"
  },
  forDirector: {
    type: Boolean,
    default: false
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
  isLawServiceRelated: {
    type: Boolean,
    default: false
  },
  isLawResearchRelated: {
    type: Boolean,
    default: false
  },
  partnershipRequestType: {
    type: String,
    enum: ["strategic", "operational", "project", "tactical"],
    required: false
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
      duration: {
        type: Number,
        min: [1, "Duration must be at least 1 year"]
      },
      date: { type: Date, default: Date.now },
    },
  ],
  department: String,
  companyStatus: {
    type: String,
    enum: ["Draft", "Email Sent", "Reviewed", "Approved", "Rejected"]
  },
  duration: {
    value: { type: Number },
    type: { type: String, enum: ['years', 'months'] }
  }
});

export default mongoose.model("Request", RequestSchema);
