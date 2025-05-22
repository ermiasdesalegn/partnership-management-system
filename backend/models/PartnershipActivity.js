import mongoose from "mongoose";

const PartnershipActivitySchema = new mongoose.Schema({
  partnerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true
  },
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  assignedTo: {
    type: String,
    enum: ["partner", "insa", "both"],
    required: true
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
  attachments: [{
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
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
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

// Pre-save middleware to update the updatedAt timestamp
PartnershipActivitySchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("PartnershipActivity", PartnershipActivitySchema); 