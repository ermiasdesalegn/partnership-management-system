import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
export const partnershipReviewRequest = async (req, res) => {
  try {
    const { requestId, decision, message, feedbackMessage, isLawServiceRelated, isLawResearchRelated, frameworkType, duration, forDirector, partnershipRequestType } = req.body;
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
      const isLaw = request.type === 'internal' ? (isLawServiceRelated === "true" || isLawServiceRelated === true) : false;
      request.status = "In Review";
      request.lawRelated = isLaw;
      request.isLawServiceRelated = isLawServiceRelated === "true" || isLawServiceRelated === true;
      request.isLawResearchRelated = isLawResearchRelated === "true" || isLawResearchRelated === true;
      request.frameworkType = frameworkType;
      request.partnershipRequestType = partnershipRequestType;
      
      if (duration) {
        try {
          const parsedDuration = JSON.parse(duration);
          request.duration = {
            value: parseInt(parsedDuration.value) || 3,
            type: parsedDuration.type === 'months' ? 'months' : 'years'
          };
        } catch (err) {
          console.error("Error parsing duration:", err);
          request.duration = { value: 3, type: "years" }; // Default fallback
        }
      }
      
      // Set forDirector flag based on the input
      request.forDirector = forDirector === "true" || forDirector === true;
      
      // Determine next stage based on current stage and conditions
      if (request.currentStage === "partnership-division") {
        // If both law service and law research are needed, go to law-service first
        if (request.isLawServiceRelated) {
          request.currentStage = "law-service";
        } else if (request.isLawResearchRelated) {
          request.currentStage = "law-research";
        } else if (request.forDirector) {
          request.currentStage = "director";
        } else {
          request.currentStage = "general-director";
        }
      } else if (request.currentStage === "law-service") {
        // After law service approval, check if law research is needed
        if (request.isLawResearchRelated) {
          request.currentStage = "law-research";
        } else if (request.forDirector) {
          request.currentStage = "director";
        } else {
          request.currentStage = "general-director";
        }
      } else if (request.currentStage === "law-research") {
        // After law research approval, check if director approval is needed
        if (request.forDirector) {
          request.currentStage = "director";
        } else {
          request.currentStage = "general-director";
        }
      } else if (request.currentStage === "director") {
        // After director approval, go to general director
        request.currentStage = "general-director";
      }
    } else {
      request.status = "disapproved";
      request.currentStage = "partnership-division";
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
