import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";

export const lawDepartmentReviewRequest = async (req, res) => {
  const { requestId, decision, message, feedbackMessage } = req.body;

  try {
    const request = await Request.findById(requestId);
    
    // Validate request state
    if (!request || !request.isLawRelated || request.currentStage !== "law-department") {
      return res.status(400).json({ message: "Request not ready for law department review" });
    }

    // Record decision
    request.approvals.push({
      stage: "law-department",
      approvedBy: req.admin._id,
      decision,
      message,
      feedbackMessage,
      attachments: req.files?.attachments?.map(f => f.path) || [],
      feedbackAttachments: req.files?.feedbackAttachments?.map(f => f.path) || [],
      date: new Date()
    });

    if (decision === "approve") {
      request.currentStage = "partnership-division"; // Return to partnership for forwarding
    } else {
      request.status = "Disapproved";
    }

    await request.save();
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getLawRelatedRequests = async (req, res) => {
  try {
    if (req.admin.role !== "law-department") {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }

    // Fetch all law-related requests that are in review or waiting for law department approval
    const requests = await Request.find({ lawRelated: true, currentStage: "law-department" });

    if (requests.length === 0) {
      return res.status(404).json({ status: "fail", message: "No law-related requests found" });
    }

    res.status(200).json({
      status: "success",
      message: "Law-related requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

