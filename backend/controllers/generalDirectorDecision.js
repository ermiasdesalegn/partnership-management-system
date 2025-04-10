import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";

export const generalDirectorDecision = async (req, res) => {
  const { requestId, decision, message } = req.body;

  try {
    const request = await Request.findById(requestId);
    
    // Validate request state
    if (!request || request.currentStage !== "general-director") {
      return res.status(400).json({ message: "Request not ready for general director review" });
    }

    // Record decision
    request.approvals.push({
      stage: "general-director",
      approvedBy: req.admin._id,
      decision,
      message,
    });

    // Check if all required approvals are given
    const requiredApprovals = request.isLawRelated ? 3 : 2; // 3 if law-related, 2 if not
    const approvedStages = request.approvals.filter((a) => a.decision === "approve").length;

    if (decision === "approve" && approvedStages >= requiredApprovals) {
      request.status = "Approved";
    } else if (decision === "disapprove") {
      request.status = "Disapproved";
    }

    await request.save();
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getRequestsForGeneralDirector = async (req, res) => {
  try {
    if (req.admin.role !== "general-director") {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }

    // Fetch all requests currently in review by the general director
    const requests = await Request.find({ currentStage: "general-director" });

    if (requests.length === 0) {
      return res.status(404).json({ status: "fail", message: "No requests for general director review" });
    }

    res.status(200).json({
      status: "success",
      message: "Requests for general director review retrieved successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
