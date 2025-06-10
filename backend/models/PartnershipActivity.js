import mongoose from "mongoose";

const PartnershipActivitySchema = new mongoose.Schema({
  partnerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  assignedTo: {
    type: String,
    enum: ["partner", "insa", "both"],
    required: true,
    default: "partner"
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending"
  },
  deadline: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
  },
  attachments: [
    {
      path: {
        type: String,
        required: true
      },
      originalName: {
        type: String,
        required: true
      },
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'attachments.uploaderModel',
        required: true
      },
      uploaderModel: {
        type: String,
        required: true,
        enum: ['Admin', 'User']
      },
      description: {
        type: String,
        trim: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
PartnershipActivitySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
PartnershipActivitySchema.index({ partnerRef: 1, status: 1 });
PartnershipActivitySchema.index({ assignedTo: 1, status: 1 });
PartnershipActivitySchema.index({ deadline: 1 });

export default mongoose.model("PartnershipActivity", PartnershipActivitySchema); 