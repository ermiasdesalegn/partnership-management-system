import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";

export const lawDepartmentReviewRequest = async (req, res) => {
  const { requestId, decision, message, feedbackMessage } = req.body;

  try {
    const request = await Request.findById(requestId);
    
    // Validate request state
    if (!request) {
      return res.status(400).json({ message: "Request not found" });
    }

    if (!request.lawRelated) {
      return res.status(400).json({ message: "This request is not marked as law-related" });
    }

    if (request.currentStage !== "law-department") {
      return res.status(400).json({ message: "Request is not in law department stage" });
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

export const getLawRelatedRequestsForPartnership = async (req, res) => {
  try {
    if (req.admin.role !== "partnership-division") {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }

    // Find requests that were reviewed by law department
    const requests = await Request.find({
      lawRelated: true,
      "approvals.stage": "law-department"
    }).populate("userRef", "name email")
      .populate("approvals.approvedBy", "name role")
      .populate("attachments.uploadedBy", "name");

    // Separate requests into approved and disapproved
    const approvedRequests = requests.filter(req => {
      const lawApproval = req.approvals.find(a => a.stage === "law-department");
      return lawApproval?.decision === "approve" && req.currentStage === "partnership-division";
    }).map(req => {
      const lawApproval = req.approvals.find(a => a.stage === "law-department");
      return {
        ...req.toObject(),
        lawDepartmentResponse: {
          decision: lawApproval.decision,
          message: lawApproval.message,
          feedbackMessage: lawApproval.feedbackMessage,
          attachments: lawApproval.attachments,
          feedbackAttachments: lawApproval.feedbackAttachments,
          date: lawApproval.date,
          reviewedBy: lawApproval.approvedBy
        }
      };
    });

    const disapprovedRequests = requests.filter(req => {
      const lawApproval = req.approvals.find(a => a.stage === "law-department");
      return lawApproval?.decision === "disapprove";
    }).map(req => {
      const lawApproval = req.approvals.find(a => a.stage === "law-department");
      return {
        ...req.toObject(),
        lawDepartmentResponse: {
          decision: lawApproval.decision,
          message: lawApproval.message,
          feedbackMessage: lawApproval.feedbackMessage,
          attachments: lawApproval.attachments,
          feedbackAttachments: lawApproval.feedbackAttachments,
          date: lawApproval.date,
          reviewedBy: lawApproval.approvedBy
        }
      };
    });

    res.status(200).json({
      status: "success",
      message: "Law-related requests retrieved successfully",
      data: {
        approved: approvedRequests,
        disapproved: disapprovedRequests
      }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const forwardToGeneralDirector = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (req.admin.role !== "partnership-division") {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ status: "fail", message: "Request not found" });
    }

    // Verify that the request was approved by law department
    const lawApproval = request.approvals.find(a => 
      a.stage === "law-department" && a.decision === "approve"
    );

    if (!lawApproval) {
      return res.status(400).json({ 
        status: "fail", 
        message: "Cannot forward request that hasn't been approved by law department" 
      });
    }

    // Update request stage
    request.currentStage = "general-director";
    request.status = "In Review";
    
    // Add forwarding record
    request.approvals.push({
      stage: "partnership-division",
      approvedBy: req.admin._id,
      decision: "forward",
      message: "Forwarded to General Director after law department approval",
      date: new Date()
    });

    await request.save();

    res.status(200).json({
      status: "success",
      message: "Request forwarded to General Director successfully",
      data: request
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

