import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";


export const partnershipReviewRequest = async (req, res) => {
  const { requestId, decision, isLawRelated, message } = req.body;

  try {
    const request = await Request.findById(requestId);
    
    // Validate request state
    if (!request || !["Pending", "pending"].includes(request.status) || request.currentStage !== "partnership-division") {
      return res.status(400).json({ message: "Request not ready for partnership review" });
    }

    // Record decision
    request.approvals.push({
      stage: "partnership-division",
      approvedBy: req.admin._id,
      decision,
      message,
    });

    if (decision === "approve") {
      request.status = "In Review";
      request.isLawRelated = isLawRelated;
      request.currentStage = isLawRelated ? "law-department" : "general-director";
    } else {
      request.status = "Disapproved";
    }

    await request.save();
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
