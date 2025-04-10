import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Request from "../models/Request.js";


export const forwardToGeneralDirector = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await Request.findById(requestId);
    
    // Validate request state
    if (!request || request.currentStage !== "partnership-division" || !request.isLawRelated) {
      return res.status(400).json({ message: "Request not ready for forwarding" });
    }

    request.currentStage = "general-director";
    await request.save();
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

