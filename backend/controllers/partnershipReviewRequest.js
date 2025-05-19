import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
export const partnershipReviewRequest = async (req, res) => {
  try {
    const { requestId, decision, message, feedbackMessage, isLawRelated, frameworkType, duration } = req.body;
    const admin = req.admin;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.currentStage !== admin.role) {
      return res.status(403).json({ message: "Unauthorized access to this request" });
    }

    // Support multiple file fields: attachments (admin), feedbackAttachments (user)
    // Store just the filename, not the full path
    const approval = {
      stage: admin.role,
      approvedBy: admin._id,
      decision,
      message,
      feedbackMessage,
      attachments: req.files?.attachments?.map(f => f.filename) || [],
      feedbackAttachments: req.files?.feedbackAttachments?.map(f => f.filename) || [],
      date: new Date()
    };

    request.approvals.push(approval);

    if (decision === "approve") {
      const isLaw = request.type === 'internal' ? (isLawRelated === "true" || isLawRelated === true) : false;
      request.status = "In Review";
      request.lawRelated = isLaw;
      request.frameworkType = frameworkType;
      request.duration = duration;
      request.currentStage = isLaw ? "law-department" : "general-director";
    } else {
      request.status = "Disapproved";
    }

    request.lastReviewedBy = admin._id;

    await request.save();

    const populated = await Request.findById(request._id).populate("approvals.approvedBy", "name email role");
    res.status(200).json(populated);
  } catch (err) {
    console.error("Review Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




// controllers/requestController.js
export const getPartnershipReviewedRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      "approvals.stage": "partnership-division",
      "approvals.approvedBy": req.admin._id, // Optional: Filter by reviewer
    }).sort({ createdAt: -1 });

    res.status(200).json({ status: "success", data: requests });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};


export const getPendingRequests = async (req, res) => {
  try {
    if (req.admin.role !== "partnership-division") {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }

    // Fetch all pending requests for partnership division to review
    const requests = await Request.find({ status: "Pending" });

    if (requests.length === 0) {
      return res.status(404).json({ status: "fail", message: "No pending requests found" });
    }

    res.status(200).json({
      status: "success",
      message: "Pending requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
export const getApprovedRequestsForPartnershipDivision = async (req, res) => {
  try {
    // if (req.admin.role !== "partnership-division" || req.admin.role !== "general-director") {
    //   return res.status(403).json({ status: "fail", message: "Access denied" });
    // }

    // Fetch all approved requests that the partnership division forwarded
    const requests = await Request.find({ status: "Approved", currentStage: "general-director" });

    if (requests.length === 0) {
      return res.status(404).json({ status: "fail", message: "No approved requests found" });
    }

    res.status(200).json({
      status: "success",
      message: "Approved requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getDisapprovedRequestsForLawDepartment = async (req, res) => {
  try {
    if (req.admin.role !== "law-department") {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }

    // Fetch all disapproved requests in the law department
    const requests = await Request.find({ status: "Disapproved", currentStage: "law-department" });

    if (requests.length === 0) {
      return res.status(404).json({ status: "fail", message: "No disapproved requests found" });
    }

    res.status(200).json({
      status: "success",
      message: "Disapproved requests retrieved successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
