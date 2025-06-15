import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Partner from "../models/Partners.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
};

export const generalDirectorDecision = async (req, res) => {
  const { requestId, decision, message, feedbackMessage } = req.body;

  try {
    if (!isValidObjectId(requestId)) {
      return res.status(400).json({ message: "Invalid request ID format" });
    }

    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.status(400).json({ message: "Request not found" });
    }
    if (typeof request.currentStage !== "string" || request.currentStage.trim() !== "general-director") {
      return res.status(400).json({ message: "Request not ready for general director review" });
    }

    // If already approved, block further approval
    if (request.status && request.status.toLowerCase() === "approved") {
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
      request.status = "approved";
      
      // Check if a partner with this request ID already exists
      const existingPartner = await Partner.findOne({ requestRef: request._id });
      if (existingPartner) {
        return res.status(400).json({ 
          message: "A partner record already exists for this request. Please refresh the page to see the updated status." 
        });
      }

      // Create new partner only if one doesn't exist
      await Partner.create({
        requestRef: request._id,
        companyName: request.companyDetails?.name,
        companyEmail: request.companyDetails?.email,
        companyType: request.companyDetails?.type,
        companyAddress: request.companyDetails?.address,
        frameworkType: request.frameworkType,
        partnershipRequestType: request.partnershipRequestType,
        duration: request.duration,
        status: "Active",
        requestAttachments: request.attachments || [],
        approvalAttachments: request.approvals.flatMap(a => {
          if (!a.attachments) return [];
          if (Array.isArray(a.attachments)) {
            return a.attachments.map(path => ({
              path: path.split(/[/\\]/).pop(),
              approvedBy: a.approvedBy,
              stage: a.stage,
              date: a.date || null
            }));
          }
          return [];
        })
      });
    } else if (decision === "disapprove") {
      request.status = "disapproved";
      request.currentStage = "partnership-division";
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

// Helper function for validation
const validatePrivileges = (privileges) => {
  if (!privileges || typeof privileges !== 'object') {
    throw new AppError('Invalid privileges format', 400);
  }

  const requiredRoles = ['director', 'partnership-division', 'law-service', 'law-research'];
  
  for (const role of requiredRoles) {
    if (typeof privileges[role] !== 'boolean') {
      throw new AppError(`Invalid privilege value for role: ${role}`, 400);
    }
  }

  return true;
};

export const checkPartnerAccess = catchAsync(async (req, res, next) => {
  const { partnerId } = req.params;
  const { role } = req.admin;

  // Skip validation if no partnerId is provided
  if (!partnerId) {
    return next();
  }

  if (!isValidObjectId(partnerId)) {
    throw new AppError('Invalid partner ID format', 400);
  }

  const partner = await Partner.findById(partnerId);
  if (!partner) {
    throw new AppError('Partner not found', 404);
  }

  // If partner is not operational, no need to check privileges
  if (partner.partnershipRequestType !== 'operational') {
    return next();
  }

  // Check if partner has privileges defined
  if (!partner.privileges) {
    // If no privileges defined, grant access by default
    return next();
  }

  // Check if the admin's role has access
  // Explicitly check if the role's privilege is false
  if (partner.privileges[role] === false) {
    throw new AppError('You do not have access to this partner', 403);
  }

  // If the role's privilege is not explicitly set to false, allow access
  next();
});

export const getPartnershipPrivileges = catchAsync(async (req, res) => {
  const { partnerId } = req.params;

  if (!partnerId) {
    throw new AppError('Partner ID is required', 400);
  }

  if (!isValidObjectId(partnerId)) {
    throw new AppError('Invalid partner ID format', 400);
  }

  const partner = await Partner.findById(partnerId);
  if (!partner) {
    throw new AppError('Partner not found', 404);
  }

  if (partner.partnershipRequestType !== 'operational') {
    throw new AppError('Privileges can only be managed for operational partnerships', 400);
  }

  res.status(200).json({
    status: 'success',
    data: {
      privileges: partner.privileges || {
        director: true,
        'partnership-division': true,
        'law-service': true,
        'law-research': true
      }
    }
  });
});

export const setPartnershipPrivileges = catchAsync(async (req, res) => {
  const { partnerId } = req.params;
  const { privileges } = req.body;

  if (!partnerId) {
    throw new AppError('Partner ID is required', 400);
  }

  if (!isValidObjectId(partnerId)) {
    throw new AppError('Invalid partner ID format', 400);
  }

  if (!privileges) {
    throw new AppError('Privileges data is required', 400);
  }

  // Validate privileges
  validatePrivileges(privileges);

  const partner = await Partner.findById(partnerId);
  if (!partner) {
    throw new AppError('Partner not found', 404);
  }

  if (partner.partnershipRequestType !== 'operational') {
    throw new AppError('Privileges can only be managed for operational partnerships', 400);
  }

  partner.privileges = privileges;
  await partner.save();

  res.status(200).json({
    status: 'success',
    data: {
      privileges: partner.privileges
    }
  });
});
