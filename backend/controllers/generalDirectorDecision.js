import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Partner from "../models/Partners.js";

export const generalDirectorDecision = async (req, res) => {
  const { requestId, decision, message, feedbackMessage } = req.body;

  try {
    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.status(400).json({ message: "Request not found" });
    }
    if (typeof request.currentStage !== "string" || request.currentStage.trim() !== "general-director") {
      return res.status(400).json({ message: "Request not ready for general director review" });
    }

    // If already approved, block further approval
    if (request.status === "Approved") {
      return res.status(400).json({ message: "This request has already been approved." });
    }

    // If this admin has already approved before
    const alreadyApprovedByThisAdmin = request.approvals.some(
      a => a.stage === "general-director" && String(a.approvedBy) === String(req.admin._id)
    );
    if (alreadyApprovedByThisAdmin) {
      return res.status(400).json({ message: "You have already approved this request as general director." });
    }

    // If any other admin has already approved as general director
    const alreadyApprovedByAnotherAdmin = request.approvals.some(
      a => a.stage === "general-director"
    );
    if (alreadyApprovedByAnotherAdmin) {
      return res.status(400).json({ message: "This request has already been approved by another general director." });
    }

    // Record decision
    const approval = {
      stage: "general-director",
      approvedBy: req.admin._id,
      decision,
      message,
      feedbackMessage,
      attachments: req.files?.attachments?.map(f => f.path) || [],
      feedbackAttachments: req.files?.feedbackAttachments?.map(f => f.path) || [],
      date: new Date()
    };
    request.approvals.push(approval);

    // Check if all required approvals are given
    const requiredApprovals = request.isLawRelated ? 3 : 2; // 3 if law-related, 2 if not
    const approvedStages = request.approvals.filter((a) => a.decision === "approve").length;

    if (decision === "approve" && approvedStages >= requiredApprovals) {
      request.status = "Approved";
      // Automatically create a Partner record
      await Partner.create({
        requestRef: request._id,
        companyName: request.companyDetails?.name,
        companyEmail: request.companyDetails?.email,
        companyType: request.companyDetails?.type,
        companyAddress: request.companyDetails?.address,
        frameworkType: request.frameworkType,
        duration: request.duration,
        status: "Active",
        requestAttachments: request.attachments || [],
        approvalAttachments: request.approvals.flatMap(a => {
          if (!a.attachments) return [];
          if (Array.isArray(a.attachments)) {
            return a.attachments.map(path => ({
              path,
              approvedBy: a.approvedBy,
              stage: a.stage,
              date: a.date || null
            }));
          }
          return [];
        })
      });
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
