import Partner from "../models/Partners.js";
import PartnershipActivity from "../models/PartnershipActivity.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Get overall partnership statistics (excluding operational partnerships)
export const getOverallPartnershipStatistics = catchAsync(async (req, res, next) => {
  try {
    // Get all partners excluding operational ones
    const allPartners = await Partner.find({ 
      partnershipRequestType: { $ne: 'operational' } 
    }).populate('requestRef');
    
    // Basic partnership statistics
    const totalPartners = allPartners.length;
    const signedPartners = allPartners.filter(p => p.isSigned).length;
    const unsignedPartners = totalPartners - signedPartners;
    const activePartners = allPartners.filter(p => p.status === 'Active').length;
    
    // Partnership by type (excluding operational partnerships)
    const partnershipByType = {
      strategic: allPartners.filter(p => p.partnershipRequestType === 'strategic').length,
      project: allPartners.filter(p => p.partnershipRequestType === 'project').length,
      tactical: allPartners.filter(p => p.partnershipRequestType === 'tactical').length
    };
    
    // Framework distribution
    const frameworkDistribution = {};
    allPartners.forEach(partner => {
      const framework = partner.frameworkType;
      frameworkDistribution[framework] = (frameworkDistribution[framework] || 0) + 1;
    });
    
    // Company type distribution
    const companyTypeDistribution = {};
    allPartners.forEach(partner => {
      const type = partner.companyType;
      companyTypeDistribution[type] = (companyTypeDistribution[type] || 0) + 1;
    });
    
    // Monthly partnership creation (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const monthlyData = await Partner.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          partnershipRequestType: { $ne: 'operational' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: 1 },
          signed: { $sum: { $cond: [{ $eq: ["$isSigned", true] }, 1, 0] } }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        overview: {
          totalPartners,
          signedPartners,
          unsignedPartners,
          activePartners
        },
        partnershipByType,
        frameworkDistribution,
        companyTypeDistribution,
        monthlyData
      }
    });
  } catch (error) {
    return next(new AppError("Failed to fetch partnership statistics", 500));
  }
});

// Get signed partners' activity statistics (excluding operational partnerships)
export const getSignedPartnersActivityStatistics = catchAsync(async (req, res, next) => {
  try {
    // Get all signed partners excluding operational ones
    const signedPartners = await Partner.find({ 
      isSigned: true, 
      partnershipRequestType: { $ne: 'operational' } 
    }).populate('requestRef');
    
    if (signedPartners.length === 0) {
      return res.status(200).json({
        status: "success",
        data: {
          message: "No signed partners found",
          statistics: null
        }
      });
    }
    
    // Get all activities for signed partners
    const partnerIds = signedPartners.map(p => p._id);
    const allActivities = await PartnershipActivity.find({ 
      partnerRef: { $in: partnerIds } 
    }).populate('partnerRef');
    
    // Calculate activity statistics
    const totalActivities = allActivities.length;
    const averageActivitiesPerPartner = totalActivities / signedPartners.length;
    
    const activityStatusDistribution = {
      pending: allActivities.filter(a => a.status === 'pending').length,
      in_progress: allActivities.filter(a => a.status === 'in_progress').length,
      completed: allActivities.filter(a => a.status === 'completed').length
    };
    
    const activityAssignmentDistribution = {
      partner: allActivities.filter(a => a.assignedTo === 'partner').length,
      insa: allActivities.filter(a => a.assignedTo === 'insa').length,
      both: allActivities.filter(a => a.assignedTo === 'both').length
    };
    
    // Activities by partnership type
    const activitiesByPartnershipType = {};
    signedPartners.forEach(partner => {
      const type = partner.partnershipRequestType;
      const partnerActivities = allActivities.filter(a => 
        a.partnerRef._id.toString() === partner._id.toString()
      );
      activitiesByPartnershipType[type] = {
        partners: (activitiesByPartnershipType[type]?.partners || 0) + 1,
        activities: (activitiesByPartnershipType[type]?.activities || 0) + partnerActivities.length
      };
    });
    
    // Calculate averages for each partnership type
    Object.keys(activitiesByPartnershipType).forEach(type => {
      const data = activitiesByPartnershipType[type];
      data.averageActivitiesPerPartner = data.partners > 0 ? data.activities / data.partners : 0;
    });
    
    // Enhanced partner analysis with detailed breakdown
    const currentDate = new Date();
    const partnerDetailedAnalysis = signedPartners.map(partner => {
      const partnerActivities = allActivities.filter(a => 
        a.partnerRef._id.toString() === partner._id.toString()
      );
      
      // Activity breakdown by assignee
      const partnerAssignedActivities = partnerActivities.filter(a => a.assignedTo === 'partner');
      const insaAssignedActivities = partnerActivities.filter(a => a.assignedTo === 'insa');
      const bothAssignedActivities = partnerActivities.filter(a => a.assignedTo === 'both');
      
      // Status breakdown for each assignee
      const partnerActivitiesBreakdown = {
        total: partnerAssignedActivities.length,
        completed: partnerAssignedActivities.filter(a => a.status === 'completed').length,
        inProgress: partnerAssignedActivities.filter(a => a.status === 'in_progress').length,
        pending: partnerAssignedActivities.filter(a => a.status === 'pending').length
      };
      
      const insaActivitiesBreakdown = {
        total: insaAssignedActivities.length,
        completed: insaAssignedActivities.filter(a => a.status === 'completed').length,
        inProgress: insaAssignedActivities.filter(a => a.status === 'in_progress').length,
        pending: insaAssignedActivities.filter(a => a.status === 'pending').length
      };
      
      const bothActivitiesBreakdown = {
        total: bothAssignedActivities.length,
        completed: bothAssignedActivities.filter(a => a.status === 'completed').length,
        inProgress: bothAssignedActivities.filter(a => a.status === 'in_progress').length,
        pending: bothAssignedActivities.filter(a => a.status === 'pending').length
      };
      
      // Deadline analysis
      const upcomingDeadlines = partnerActivities.filter(a => 
        a.status !== 'completed' && a.deadline && new Date(a.deadline) > currentDate
      );
      const overdueActivities = partnerActivities.filter(a => 
        a.status !== 'completed' && a.deadline && new Date(a.deadline) <= currentDate
      );
      
      // Calculate partnership end date for deadline context
      let partnershipEndDate = null;
      if (partner.signedAt && partner.requestRef?.duration) {
        const signedDate = new Date(partner.signedAt);
        partnershipEndDate = new Date(signedDate);
        
        const duration = partner.requestRef.duration;
        if (typeof duration === 'object' && duration.type) {
          if (duration.type === "months") {
            partnershipEndDate.setMonth(partnershipEndDate.getMonth() + parseInt(duration.value));
          } else {
            partnershipEndDate.setFullYear(partnershipEndDate.getFullYear() + parseInt(duration.value));
          }
        } else {
          partnershipEndDate.setFullYear(partnershipEndDate.getFullYear() + parseInt(duration));
        }
      }
      
      // Calculate days until partnership ends
      const daysUntilPartnershipEnd = partnershipEndDate ? 
        Math.ceil((partnershipEndDate - currentDate) / (1000 * 60 * 60 * 24)) : null;
      
      // Calculate completion rates
      const totalPartnerActivities = partnerActivities.length;
      const completedActivities = partnerActivities.filter(a => a.status === 'completed').length;
      const overallCompletionRate = totalPartnerActivities > 0 ? (completedActivities / totalPartnerActivities) * 100 : 0;
      
      const partnerCompletionRate = partnerActivitiesBreakdown.total > 0 ? 
        (partnerActivitiesBreakdown.completed / partnerActivitiesBreakdown.total) * 100 : 0;
      const insaCompletionRate = insaActivitiesBreakdown.total > 0 ? 
        (insaActivitiesBreakdown.completed / insaActivitiesBreakdown.total) * 100 : 0;
      
      return {
        partnerId: partner._id,
        companyName: partner.companyName,
        partnershipType: partner.partnershipRequestType,
        frameworkType: partner.frameworkType,
        signedAt: partner.signedAt,
        partnershipEndDate,
        daysUntilPartnershipEnd,
        
        // Overall activity summary
        totalActivities: totalPartnerActivities,
        completedActivities,
        overallCompletionRate: Math.round(overallCompletionRate * 100) / 100,
        
        // Detailed breakdown by assignee
        partnerActivities: partnerActivitiesBreakdown,
        insaActivities: insaActivitiesBreakdown,
        bothActivities: bothActivitiesBreakdown,
        
        // Completion rates by assignee
        partnerCompletionRate: Math.round(partnerCompletionRate * 100) / 100,
        insaCompletionRate: Math.round(insaCompletionRate * 100) / 100,
        
        // Deadline analysis
        upcomingDeadlines: upcomingDeadlines.length,
        overdueActivities: overdueActivities.length,
        activitiesNeedingAttention: upcomingDeadlines.length + overdueActivities.length,
        
        // Detailed deadline breakdown
        upcomingDeadlinesList: upcomingDeadlines.map(a => ({
          title: a.title,
          deadline: a.deadline,
          assignedTo: a.assignedTo,
          status: a.status,
          daysUntilDeadline: Math.ceil((new Date(a.deadline) - currentDate) / (1000 * 60 * 60 * 24))
        })).sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline),
        
        overdueActivitiesList: overdueActivities.map(a => ({
          title: a.title,
          deadline: a.deadline,
          assignedTo: a.assignedTo,
          status: a.status,
          daysOverdue: Math.ceil((currentDate - new Date(a.deadline)) / (1000 * 60 * 60 * 24))
        })).sort((a, b) => b.daysOverdue - a.daysOverdue)
      };
    });
    
    // Sort by overall completion rate (descending)
    partnerDetailedAnalysis.sort((a, b) => b.overallCompletionRate - a.overallCompletionRate);
    
    // Calculate overall averages and totals for partner vs INSA
    const totalPartnerActivities = allActivities.filter(a => a.assignedTo === 'partner').length;
    const totalInsaActivities = allActivities.filter(a => a.assignedTo === 'insa').length;
    const totalBothActivities = allActivities.filter(a => a.assignedTo === 'both').length;
    
    const completedPartnerActivities = allActivities.filter(a => a.assignedTo === 'partner' && a.status === 'completed').length;
    const completedInsaActivities = allActivities.filter(a => a.assignedTo === 'insa' && a.status === 'completed').length;
    const completedBothActivities = allActivities.filter(a => a.assignedTo === 'both' && a.status === 'completed').length;
    
    // Generate insights and notes
    const insights = {
      totalPartnersAnalyzed: signedPartners.length,
      totalActivitiesTracked: totalActivities,
      averageActivitiesPerPartner: Math.round(averageActivitiesPerPartner * 100) / 100,
      
      workloadDistribution: {
        partner: {
          total: totalPartnerActivities,
          completed: completedPartnerActivities,
          completionRate: totalPartnerActivities > 0 ? Math.round((completedPartnerActivities / totalPartnerActivities) * 10000) / 100 : 0,
          averagePerPartner: Math.round((totalPartnerActivities / signedPartners.length) * 100) / 100
        },
        insa: {
          total: totalInsaActivities,
          completed: completedInsaActivities,
          completionRate: totalInsaActivities > 0 ? Math.round((completedInsaActivities / totalInsaActivities) * 10000) / 100 : 0,
          averagePerPartner: Math.round((totalInsaActivities / signedPartners.length) * 100) / 100
        },
        both: {
          total: totalBothActivities,
          completed: completedBothActivities,
          completionRate: totalBothActivities > 0 ? Math.round((completedBothActivities / totalBothActivities) * 10000) / 100 : 0,
          averagePerPartner: Math.round((totalBothActivities / signedPartners.length) * 100) / 100
        }
      },
      
      urgentAttentionNeeded: partnerDetailedAnalysis.filter(p => p.overdueActivities > 0).length,
      upcomingDeadlinesTotal: partnerDetailedAnalysis.reduce((sum, p) => sum + p.upcomingDeadlines, 0),
      overdueActivitiesTotal: partnerDetailedAnalysis.reduce((sum, p) => sum + p.overdueActivities, 0),
      
      topPerformers: partnerDetailedAnalysis.slice(0, 3).map(p => ({
        name: p.companyName,
        completionRate: p.overallCompletionRate
      })),
      
      needsImprovementPartners: partnerDetailedAnalysis.filter(p => p.overallCompletionRate < 50).length
    };

    res.status(200).json({
      status: "success",
      data: {
        overview: {
          totalSignedPartners: signedPartners.length,
          totalActivities,
          averageActivitiesPerPartner: Math.round(averageActivitiesPerPartner * 100) / 100
        },
        activityStatusDistribution,
        activityAssignmentDistribution,
        activitiesByPartnershipType,
        partnerDetailedAnalysis,
        insights,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return next(new AppError("Failed to fetch signed partners activity statistics", 500));
  }
}); 