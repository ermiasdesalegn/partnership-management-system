// ... existing code ...
export const createActivity = catchAsync(async (req, res, next) => {
    const { title, description, assignedTo, deadline } = req.body;
    const { partnerId } = req.params;
  
    console.log("Request body:", req.body);
    console.log("Partner ID:", partnerId);
  
    // Check if partner exists and is signed
    const partner = await Partner.findById(partnerId).populate('requestRef');
    if (!partner) {
      return next(new AppError("Partner not found", 404));
    }
    if (!partner.isSigned) {
      return next(new AppError("Cannot create activities for unsigned partners", 400));
    }
  
    console.log("Partner data:", partner);
    console.log("Signed date:", partner.signedAt);
    console.log("Duration:", partner.requestRef.duration);
  
    // Calculate deadline based on partner's signed date and duration
    const signedDate = new Date(partner.signedAt);
    const endDate = new Date(signedDate);
    
    const duration = partner.requestRef.duration;
    if (!duration) {
      return next(new AppError("Partner duration not found", 400));
    }
  
    console.log("Initial end date:", endDate);
  
    if (duration.type === "months") {
      endDate.setMonth(endDate.getMonth() + parseInt(duration.value));
    } else {
      endDate.setFullYear(endDate.getFullYear() + parseInt(duration.value));
    }
  
    console.log("Final end date:", endDate);
  
    const activity = await PartnershipActivity.create({
      partnerRef: partnerId,
      title,
      description,
      assignedTo,
      deadline: endDate,
      createdBy: req.admin._id
    });
  
    console.log("Created activity:", activity);
  
    res.status(201).json({
      status: "success",
      data: activity
    });
  });
  // ... existing code ...