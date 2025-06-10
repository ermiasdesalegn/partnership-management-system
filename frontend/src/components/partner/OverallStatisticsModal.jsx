import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FaTimes, 
  FaFileDownload, 
  FaChartLine, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';
import { fetchOverallPartnershipStatistics, fetchSignedPartnersActivityStatistics } from '../../api/adminApi';

const OverallStatisticsModal = ({ isOpen, onClose }) => {
  const printRef = useRef();

  const { data: overallStats, isLoading: overallLoading, error: overallError } = useQuery({
    queryKey: ['overallPartnershipStatistics'],
    queryFn: fetchOverallPartnershipStatistics,
    enabled: isOpen,
    retry: false,
    staleTime: 0
  });

  const { data: activityStats, isLoading: activityLoading, error: activityError } = useQuery({
    queryKey: ['signedPartnersActivityStatistics'],
    queryFn: fetchSignedPartnersActivityStatistics,
    enabled: isOpen,
    retry: false,
    staleTime: 0
  });

  const generateReport = () => {
    const printWindow = window.open('', '_blank');
    const reportContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>INSA Partnership Performance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3c8dbc; padding-bottom: 20px; }
            .company-name { color: #3c8dbc; font-size: 28px; font-weight: bold; }
            .report-subtitle { color: #666; font-size: 16px; margin-top: 5px; }
            .report-date { color: #666; font-size: 14px; margin-top: 10px; }
            .section { margin: 25px 0; page-break-inside: avoid; }
            .section-title { color: #3c8dbc; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #ddd; padding-bottom: 8px; }
            .overview-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .overview-table th, .overview-table td { border: 1px solid #ddd; padding: 12px; text-align: center; }
            .overview-table th { background-color: #3c8dbc; color: white; font-weight: bold; }
            .partner-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11px; }
            .partner-table th, .partner-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .partner-table th { background-color: #f8f9fa; font-weight: bold; color: #333; }
            .partner-table .text-center { text-align: center; }
            .stat-highlight { background-color: #e7f3ff; font-weight: bold; }
            .completion-high { color: #28a745; font-weight: bold; }
            .completion-medium { color: #ffc107; font-weight: bold; }
            .completion-low { color: #dc3545; font-weight: bold; }
            .urgent { background-color: #fff5f5; color: #dc3545; }
            .warning { background-color: #fffbf0; color: #f59e0b; }
            .good { background-color: #f0fdf4; color: #16a34a; }
            .notes-section { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .notes-title { color: #3c8dbc; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
            .note-item { margin: 8px 0; padding: 5px 0; border-bottom: 1px dotted #ccc; }
            .workload-comparison { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 15px 0; }
            .workload-card { border: 1px solid #ddd; padding: 15px; text-align: center; border-radius: 5px; }
            .workload-title { font-weight: bold; color: #3c8dbc; margin-bottom: 8px; }
            @media print { 
              body { margin: 0; font-size: 10px; } 
              .no-print { display: none; }
              .section { page-break-inside: avoid; }
              .partner-table { font-size: 9px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">INSA Partnership Performance Report</div>
            <div class="report-subtitle">Comprehensive Analysis of Partnership Activities & Performance</div>
            <div class="report-date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          </div>
          ${reportContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  if (!isOpen) return null;

  if (overallLoading || activityLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3c8dbc]"></div>
            <span className="ml-3">Loading comprehensive statistics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (overallError || activityError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Statistics</div>
            <div className="text-gray-700 mb-4">
              {overallError?.message || activityError?.message || 'Failed to load statistics'}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getCompletionRateClass = (rate) => {
    if (rate >= 80) return 'text-green-600 font-bold';
    if (rate >= 50) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  const getStatusClass = (urgentCount, overdueCount) => {
    if (overdueCount > 0) return 'urgent';
    if (urgentCount > 0) return 'warning';
    return 'good';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-[#3c8dbc] flex items-center">
            <FaChartLine className="mr-3" />
            Partnership Performance Analysis (Strategic, Project & Tactical)
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={generateReport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <FaFileDownload className="mr-2" />
              Generate Full Report
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div ref={printRef}>
            {/* Executive Summary */}
            <div className="section">
              <div className="section-title">Executive Summary (Excluding Operational Partnerships)</div>
              <table className="overview-table">
                <thead>
                  <tr>
                    <th>Partnership Overview</th>
                    <th>Activity Performance</th>
                    <th>Workload Distribution</th>
                    <th>Attention Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="stat-highlight">{overallStats?.overview?.totalPartners || 0}</div>
                      Total Partners<br/>
                      <div className="text-green-600 font-bold">{overallStats?.overview?.signedPartners || 0}</div>
                      Signed & Active
                    </td>
                    <td>
                      <div className="stat-highlight">{activityStats?.overview?.totalActivities || 0}</div>
                      Total Activities<br/>
                      <div className="text-blue-600 font-bold">{activityStats?.overview?.averageActivitiesPerPartner || 0}</div>
                      Avg per Partner
                    </td>
                    <td>
                      Partner: <span className="text-purple-600 font-bold">{activityStats?.insights?.workloadDistribution?.partner?.total || 0}</span><br/>
                      INSA: <span className="text-green-600 font-bold">{activityStats?.insights?.workloadDistribution?.insa?.total || 0}</span><br/>
                      Joint: <span className="text-blue-600 font-bold">{activityStats?.insights?.workloadDistribution?.both?.total || 0}</span>
                    </td>
                    <td>
                      <div className="text-red-600 font-bold">{activityStats?.insights?.overdueActivitiesTotal || 0}</div>
                      Overdue Tasks<br/>
                      <div className="text-yellow-600 font-bold">{activityStats?.insights?.upcomingDeadlinesTotal || 0}</div>
                      Upcoming Deadlines
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Workload Analysis */}
            <div className="section">
              <div className="section-title">Partner vs INSA Workload Analysis</div>
              <div className="workload-comparison">
                <div className="workload-card">
                  <div className="workload-title">Partner Activities</div>
                  <div className="text-2xl font-bold text-purple-600">{activityStats?.insights?.workloadDistribution?.partner?.total || 0}</div>
                  <div className="text-sm text-gray-600">
                    Completed: {activityStats?.insights?.workloadDistribution?.partner?.completed || 0}<br/>
                    Rate: {activityStats?.insights?.workloadDistribution?.partner?.completionRate || 0}%<br/>
                    Avg/Partner: {activityStats?.insights?.workloadDistribution?.partner?.averagePerPartner || 0}
                  </div>
                </div>
                <div className="workload-card">
                  <div className="workload-title">INSA Activities</div>
                  <div className="text-2xl font-bold text-green-600">{activityStats?.insights?.workloadDistribution?.insa?.total || 0}</div>
                  <div className="text-sm text-gray-600">
                    Completed: {activityStats?.insights?.workloadDistribution?.insa?.completed || 0}<br/>
                    Rate: {activityStats?.insights?.workloadDistribution?.insa?.completionRate || 0}%<br/>
                    Avg/Partner: {activityStats?.insights?.workloadDistribution?.insa?.averagePerPartner || 0}
                  </div>
                </div>
                <div className="workload-card">
                  <div className="workload-title">Joint Activities</div>
                  <div className="text-2xl font-bold text-blue-600">{activityStats?.insights?.workloadDistribution?.both?.total || 0}</div>
                  <div className="text-sm text-gray-600">
                    Completed: {activityStats?.insights?.workloadDistribution?.both?.completed || 0}<br/>
                    Rate: {activityStats?.insights?.workloadDistribution?.both?.completionRate || 0}%<br/>
                    Avg/Partner: {activityStats?.insights?.workloadDistribution?.both?.averagePerPartner || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Partner Performance Table */}
            <div className="section">
              <div className="section-title">Detailed Partner Performance Analysis</div>
              <table className="partner-table">
                <thead>
                  <tr>
                    <th>Partner Details</th>
                    <th className="text-center">Partnership<br/>Duration</th>
                    <th className="text-center">Total<br/>Activities</th>
                    <th className="text-center">Partner Tasks<br/>(Completed/Total)</th>
                    <th className="text-center">INSA Tasks<br/>(Completed/Total)</th>
                    <th className="text-center">Joint Tasks<br/>(Completed/Total)</th>
                    <th className="text-center">Overall<br/>Completion</th>
                    <th className="text-center">Upcoming<br/>Deadlines</th>
                    <th className="text-center">Overdue<br/>Tasks</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activityStats?.partnerDetailedAnalysis?.map((partner, index) => (
                    <tr key={partner.partnerId} className={getStatusClass(partner.upcomingDeadlines, partner.overdueActivities)}>
                      <td>
                        <div className="font-bold text-gray-800">{partner.companyName}</div>
                        <div className="text-xs text-gray-600">
                          {partner.partnershipType} - {partner.frameworkType}<br/>
                          Signed: {new Date(partner.signedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="text-center">
                        {partner.daysUntilPartnershipEnd !== null ? (
                          partner.daysUntilPartnershipEnd > 0 ? 
                            `${partner.daysUntilPartnershipEnd} days left` : 
                            'Expired'
                        ) : 'N/A'}
                      </td>
                      <td className="text-center font-bold">{partner.totalActivities}</td>
                      <td className="text-center">
                        <div className="font-bold">{partner.partnerActivities.completed}/{partner.partnerActivities.total}</div>
                        <div className={`text-xs ${getCompletionRateClass(partner.partnerCompletionRate)}`}>
                          {partner.partnerCompletionRate}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="font-bold">{partner.insaActivities.completed}/{partner.insaActivities.total}</div>
                        <div className={`text-xs ${getCompletionRateClass(partner.insaCompletionRate)}`}>
                          {partner.insaCompletionRate}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="font-bold">{partner.bothActivities.completed}/{partner.bothActivities.total}</div>
                        <div className="text-xs text-gray-600">
                          {partner.bothActivities.total > 0 ? 
                            Math.round((partner.bothActivities.completed / partner.bothActivities.total) * 100) : 0}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className={`font-bold text-lg ${getCompletionRateClass(partner.overallCompletionRate)}`}>
                          {partner.overallCompletionRate}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="font-bold text-yellow-600">{partner.upcomingDeadlines}</div>
                        {partner.upcomingDeadlines > 0 && (
                          <div className="text-xs text-gray-600">
                            Next: {partner.upcomingDeadlinesList[0]?.daysUntilDeadline} days
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="font-bold text-red-600">{partner.overdueActivities}</div>
                        {partner.overdueActivities > 0 && (
                          <div className="text-xs text-gray-600">
                            Max: {Math.max(...partner.overdueActivitiesList.map(a => a.daysOverdue))} days
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        {partner.overdueActivities > 0 ? (
                          <FaExclamationTriangle className="text-red-500 mx-auto" title="Urgent Attention Required" />
                        ) : partner.upcomingDeadlines > 0 ? (
                          <FaClock className="text-yellow-500 mx-auto" title="Monitor Progress" />
                        ) : (
                          <FaCheckCircle className="text-green-500 mx-auto" title="On Track" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Key Insights & Recommendations */}
            <div className="section">
              <div className="notes-section">
                <div className="notes-title">📊 Key Insights & Performance Notes</div>
                
                <div className="note-item">
                  <strong>Partnership Portfolio:</strong> Currently managing {activityStats?.insights?.totalPartnersAnalyzed || 0} signed partnerships 
                  with {activityStats?.insights?.totalActivitiesTracked || 0} total activities tracked across all partnerships.
                </div>
                
                <div className="note-item">
                  <strong>Workload Distribution Analysis:</strong> 
                  Partners handle {activityStats?.insights?.workloadDistribution?.partner?.total || 0} activities 
                  ({activityStats?.insights?.workloadDistribution?.partner?.completionRate || 0}% completion rate), 
                  while INSA manages {activityStats?.insights?.workloadDistribution?.insa?.total || 0} activities 
                  ({activityStats?.insights?.workloadDistribution?.insa?.completionRate || 0}% completion rate). 
                  Joint activities total {activityStats?.insights?.workloadDistribution?.both?.total || 0} 
                  ({activityStats?.insights?.workloadDistribution?.both?.completionRate || 0}% completion rate).
                </div>
                
                <div className="note-item">
                  <strong>Performance Leaders:</strong> 
                  {activityStats?.insights?.topPerformers?.map((performer, index) => 
                    `${index + 1}. ${performer.name} (${performer.completionRate}%)`
                  ).join(', ') || 'No performance data available'}
                </div>
                
                <div className="note-item">
                  <strong>⚠️ Attention Required:</strong> {activityStats?.insights?.urgentAttentionNeeded || 0} partners have overdue activities. 
                  {activityStats?.insights?.overdueActivitiesTotal || 0} total overdue tasks need immediate attention. 
                  Additionally, {activityStats?.insights?.upcomingDeadlinesTotal || 0} activities have upcoming deadlines requiring monitoring.
                </div>
                
                <div className="note-item">
                  <strong>Performance Improvement Needed:</strong> {activityStats?.insights?.needsImprovementPartners || 0} partners 
                  have completion rates below 50% and may require additional support or intervention.
                </div>
                
                <div className="note-item">
                  <strong>Partnership Type Analysis:</strong> 
                  {Object.entries(overallStats?.partnershipByType || {})
                    .filter(([type]) => type !== 'operational')
                    .map(([type, count]) => 
                      `${type.charAt(0).toUpperCase() + type.slice(1)}: ${count} partnerships`
                    ).join(' | ')}
                </div>
                
                <div className="note-item">
                  <strong>📈 Recommendations:</strong>
                  <ul className="ml-5 mt-2 list-disc">
                    <li>Focus immediate attention on partners with overdue activities</li>
                    <li>Provide additional support to partners with completion rates below 50%</li>
                    <li>Monitor upcoming deadlines closely to prevent future delays</li>
                    <li>Consider workload rebalancing if INSA completion rates significantly differ from partner rates</li>
                    <li>Establish regular check-ins with underperforming partnerships</li>
                  </ul>
                </div>
                
                <div className="note-item bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <strong>📋 Report Scope:</strong> This report includes Strategic, Project, and Tactical partnerships only. 
                  Operational partnerships are excluded and will have their own dedicated report.
                </div>
                
                <div className="note-item">
                  <strong>Report Generated:</strong> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()} 
                  | Data reflects real-time partnership performance metrics
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallStatisticsModal; 