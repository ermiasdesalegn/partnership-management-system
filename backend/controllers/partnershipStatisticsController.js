import Partner from "../models/Partners.js";
import PartnershipActivity from "../models/PartnershipActivity.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Get overall partnership statistics
export const getOverallPartnershipStatistics = catchAsync(async (req, res) => {
  console.log('Fetching overall partnership statistics...');

  // Get all partners except operational ones
  const partners = await Partner.find({
      partnershipRequestType: { $ne: 'operational' } 
  });
  console.log('Found partners:', partners.length);
  console.log('Partner types:', partners.map(p => p.partnershipRequestType));

  // Get all activities for these partners
  const activities = await PartnershipActivity.find({
    partnerRef: { $in: partners.map(p => p._id) }
  });
  console.log('Found activities:', activities.length);
  console.log('Activity statuses:', activities.map(a => a.status));

  // Calculate basic stats
  const basicStats = {
    totalPartners: partners.length,
    signedPartners: partners.filter(p => p.isSigned).length,
    unsignedPartners: partners.filter(p => !p.isSigned).length,
    totalActivities: activities.length
  };
  console.log('Basic stats:', basicStats);

  // Calculate partnership by type
  const partnershipByType = partners.reduce((acc, partner) => {
    const type = partner.partnershipRequestType;
    if (!acc[type]) {
      acc[type] = { total: 0, signed: 0, unsigned: 0 };
    }
    acc[type].total++;
    if (partner.isSigned) {
      acc[type].signed++;
    } else {
      acc[type].unsigned++;
    }
    return acc;
  }, {});
  console.log('Partnership by type:', partnershipByType);

  // Calculate partner analysis
  const partnerAnalysis = partners.map(partner => {
    const partnerActivities = activities.filter(a => 
      a.partnerRef.toString() === partner._id.toString()
    );
    const completedActivities = partnerActivities.filter(a => a.status === 'completed').length;
    const pendingActivities = partnerActivities.filter(a => a.status === 'pending').length;
    const inProgressActivities = partnerActivities.filter(a => a.status === 'in_progress').length;
    const completionRate = partnerActivities.length > 0 
      ? (completedActivities / partnerActivities.length) * 100 
      : 0;

    // Calculate workload breakdown by assignee
    const partnerTasks = partnerActivities.filter(a => a.assignedTo === 'partner');
    const insaTasks = partnerActivities.filter(a => a.assignedTo === 'insa');
    const bothTasks = partnerActivities.filter(a => a.assignedTo === 'both');

    const partnerTasksCompleted = partnerTasks.filter(a => a.status === 'completed').length;
    const insaTasksCompleted = insaTasks.filter(a => a.status === 'completed').length;
    const bothTasksCompleted = bothTasks.filter(a => a.status === 'completed').length;

    return {
      partnerId: partner._id,
      companyName: partner.companyName,
      partnershipType: partner.partnershipRequestType,
      totalActivities: partnerActivities.length,
      completed: completedActivities,
      pending: pendingActivities,
      in_progress: inProgressActivities,
      completionRate,
      status: partner.status,
      isSigned: partner.isSigned,
      workloadBreakdown: {
        partner: {
          total: partnerTasks.length,
          completed: partnerTasksCompleted,
          completionRate: partnerTasks.length > 0 ? Math.round((partnerTasksCompleted / partnerTasks.length) * 100) : 0
        },
        insa: {
          total: insaTasks.length,
          completed: insaTasksCompleted,
          completionRate: insaTasks.length > 0 ? Math.round((insaTasksCompleted / insaTasks.length) * 100) : 0
        },
        both: {
          total: bothTasks.length,
          completed: bothTasksCompleted,
          completionRate: bothTasks.length > 0 ? Math.round((bothTasksCompleted / bothTasks.length) * 100) : 0
        }
      }
    };
  });
  console.log('Partner analysis:', partnerAnalysis);

  // Calculate insights
  const insights = {
    topPerformers: partnerAnalysis
      .filter(p => p.totalActivities > 0 && p.completionRate >= 80)
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 3),
    needsImprovement: partnerAnalysis.filter(p => p.completionRate < 50).length,
    averageCompletionRate: partnerAnalysis.length > 0
      ? partnerAnalysis.reduce((sum, p) => sum + p.completionRate, 0) / partnerAnalysis.length
      : 0
  };
  console.log('Insights:', insights);

  // Calculate workload distribution
  const workloadDistribution = {
    partner: {
      total: activities.filter(a => a.assignedTo === 'partner').length,
      completed: activities.filter(a => a.assignedTo === 'partner' && a.status === 'completed').length,
      completionRate: 0,
      averagePerPartner: 0
    },
    insa: {
      total: activities.filter(a => a.assignedTo === 'insa').length,
      completed: activities.filter(a => a.assignedTo === 'insa' && a.status === 'completed').length,
      completionRate: 0,
      averagePerPartner: 0
    },
    both: {
      total: activities.filter(a => a.assignedTo === 'both').length,
      completed: activities.filter(a => a.assignedTo === 'both' && a.status === 'completed').length,
      completionRate: 0,
      averagePerPartner: 0
    }
  };

  // Calculate completion rates and averages
  Object.keys(workloadDistribution).forEach(key => {
    const stats = workloadDistribution[key];
    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    stats.averagePerPartner = partners.length > 0 ? stats.total / partners.length : 0;
  });

  const response = {
        status: "success",
        data: {
      partners: {
        total: basicStats.totalPartners,
        signed: basicStats.signedPartners,
        unsigned: basicStats.unsignedPartners,
        byType: partnershipByType
      },
      activities: {
        total: activities.length,
        completed: activities.filter(a => a.status === 'completed').length,
        in_progress: activities.filter(a => a.status === 'in_progress').length,
        pending: activities.filter(a => a.status === 'pending').length,
        overdue: activities.filter(a => a.status === 'overdue').length,
        upcoming: activities.filter(a => a.status === 'upcoming').length
      },
      workloadDistribution,
      partnerDetailedAnalysis: partnerAnalysis,
      insights
    }
  };

  console.log('Sending response:', JSON.stringify(response, null, 2));
  res.status(200).json(response);
});

// Get signed partners activity statistics
export const getSignedPartnersActivityStatistics = catchAsync(async (req, res) => {
  // Get all signed partners
  const partners = await Partner.find({
    isSigned: true
  });

  // Get all activities for these partners
  const activities = await PartnershipActivity.find({
    partnerRef: { $in: partners.map(p => p._id) }
  });

  // Calculate statistics similar to overall statistics but only for signed partners
  const totalPartners = partners.length;
  const totalActivities = activities.length;

  // Calculate workload distribution
  const workloadDistribution = {
    partner: {
      total: activities.filter(a => a.assignedTo === 'partner').length,
      completed: activities.filter(a => a.assignedTo === 'partner' && a.status === 'completed').length
    },
    insa: {
      total: activities.filter(a => a.assignedTo === 'insa').length,
      completed: activities.filter(a => a.assignedTo === 'insa' && a.status === 'completed').length
    },
    both: {
      total: activities.filter(a => a.assignedTo === 'both').length,
      completed: activities.filter(a => a.assignedTo === 'both' && a.status === 'completed').length
    }
  };

  // Calculate completion rates
  Object.keys(workloadDistribution).forEach(key => {
    const { total, completed } = workloadDistribution[key];
    workloadDistribution[key].completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    workloadDistribution[key].averagePerPartner = total > 0 ? Math.round((total / totalPartners) * 10) / 10 : 0;
  });

  // Calculate partner-specific statistics
  const partnerDetailedAnalysis = await Promise.all(partners.map(async partner => {
    const partnerActivities = activities.filter(a => a.partnerRef.toString() === partner._id.toString());
    const totalPartnerActivities = partnerActivities.length;
    
    const partnerTasks = partnerActivities.filter(a => a.assignedTo === 'partner');
    const insaTasks = partnerActivities.filter(a => a.assignedTo === 'insa');
    const bothTasks = partnerActivities.filter(a => a.assignedTo === 'both');

    const partnerCompletionRate = partnerTasks.length > 0 
      ? Math.round((partnerTasks.filter(t => t.status === 'completed').length / partnerTasks.length) * 100)
      : 0;

    const insaCompletionRate = insaTasks.length > 0
      ? Math.round((insaTasks.filter(t => t.status === 'completed').length / insaTasks.length) * 100)
      : 0;

    const overallCompletionRate = totalPartnerActivities > 0
      ? Math.round((partnerActivities.filter(a => a.status === 'completed').length / totalPartnerActivities) * 100)
      : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingDeadlines = partnerActivities.filter(a => {
      if (a.status === 'completed') return false;
      const deadline = new Date(a.deadline);
      deadline.setHours(0, 0, 0, 0);
      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    });

    const overdueActivities = partnerActivities.filter(a => {
      if (a.status === 'completed') return false;
      const deadline = new Date(a.deadline);
      deadline.setHours(0, 0, 0, 0);
      return deadline < today;
    });
      
      return {
        partnerId: partner._id,
        companyName: partner.companyName,
        partnershipType: partner.partnershipRequestType,
        frameworkType: partner.frameworkType,
        signedAt: partner.signedAt,
      daysUntilPartnershipEnd: partner.duration && partner.signedAt ? 
        Math.ceil((new Date(partner.signedAt.getTime() + partner.duration * 24 * 60 * 60 * 1000) - today) / (1000 * 60 * 60 * 24)) : 
        null,
        totalActivities: totalPartnerActivities,
      partnerActivities: {
        total: partnerTasks.length,
        completed: partnerTasks.filter(t => t.status === 'completed').length
      },
      insaActivities: {
        total: insaTasks.length,
        completed: insaTasks.filter(t => t.status === 'completed').length
      },
      bothActivities: {
        total: bothTasks.length,
        completed: bothTasks.filter(t => t.status === 'completed').length
      },
      partnerCompletionRate,
      insaCompletionRate,
      overallCompletionRate,
        upcomingDeadlines: upcomingDeadlines.length,
        upcomingDeadlinesList: upcomingDeadlines.map(a => ({
        activityId: a._id,
          title: a.title,
          deadline: a.deadline,
        daysUntilDeadline: Math.ceil((new Date(a.deadline) - today) / (1000 * 60 * 60 * 24))
      })),
      overdueActivities: overdueActivities.length,
        overdueActivitiesList: overdueActivities.map(a => ({
        activityId: a._id,
          title: a.title,
          deadline: a.deadline,
        daysOverdue: Math.ceil((today - new Date(a.deadline)) / (1000 * 60 * 60 * 24))
      }))
    };
  }));

  // Calculate insights
    const insights = {
    totalPartnersAnalyzed: totalPartners,
      totalActivitiesTracked: totalActivities,
    workloadDistribution,
    overdueActivitiesTotal: partnerDetailedAnalysis.reduce((sum, p) => sum + p.overdueActivities, 0),
    upcomingDeadlinesTotal: partnerDetailedAnalysis.reduce((sum, p) => sum + p.upcomingDeadlines, 0),
      urgentAttentionNeeded: partnerDetailedAnalysis.filter(p => p.overdueActivities > 0).length,
    needsImprovementPartners: partnerDetailedAnalysis.filter(p => p.overallCompletionRate < 50).length,
    topPerformers: partnerDetailedAnalysis
      .filter(p => p.totalActivities > 0)
      .sort((a, b) => b.overallCompletionRate - a.overallCompletionRate)
      .slice(0, 3)
      .map(p => ({
        name: p.companyName,
        completionRate: p.overallCompletionRate
      }))
    };

    res.status(200).json({
    status: 'success',
      data: {
        overview: {
        totalPartners,
          totalActivities,
        averageActivitiesPerPartner: totalPartners > 0 ? Math.round((totalActivities / totalPartners) * 10) / 10 : 0
        },
        insights,
      partnerDetailedAnalysis
      }
    });
}); 