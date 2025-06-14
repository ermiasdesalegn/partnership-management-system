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
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const OverallStatisticsModal = ({ isOpen, onClose }) => {
  const printRef = useRef();

  const { data: overallStats, isLoading: overallLoading, error: overallError } = useQuery({
    queryKey: ['overallStatistics'],
    queryFn: fetchOverallPartnershipStatistics,
    enabled: isOpen
  });

  const { data: signedPartnersStats, isLoading: signedPartnersLoading, error: signedPartnersError } = useQuery({
    queryKey: ['signedPartnersStatistics'],
    queryFn: fetchSignedPartnersActivityStatistics,
    enabled: isOpen
  });

  const generateReport = () => {
    const printWindow = window.open('', '_blank');
    
    // Get the partner analysis data
    const partners = overallStats?.partnerDetailedAnalysis || [];
    
    // Create the partner table HTML
    const partnerTableHtml = partners.length > 0 ? `
      <div class="section">
        <div class="section-title">Partner Analysis</div>
        <table class="partner-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Type</th>
              <th>Total Activities</th>
              <th>Pending</th>
              <th>In Progress</th>
              <th>Completed</th>
              <th>Partner Tasks</th>
              <th>INSA Tasks</th>
              <th>Both Tasks</th>
              <th>Overall Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${partners.map(partner => `
              <tr>
                <td>${partner.companyName}</td>
                <td class="text-center">${partner.partnershipType}</td>
                <td class="text-center">${partner.totalActivities || 0}</td>
                <td class="text-center">${partner.pending || 0}</td>
                <td class="text-center">${partner.in_progress || 0}</td>
                <td class="text-center">${partner.completed || 0}</td>
                <td class="text-center">
                  <div>${partner.workloadBreakdown?.partner?.completed || 0}/${partner.workloadBreakdown?.partner?.total || 0}</div>
                  <div><strong>${partner.workloadBreakdown?.partner?.completionRate || 0}%</strong></div>
                </td>
                <td class="text-center">
                  <div>${partner.workloadBreakdown?.insa?.completed || 0}/${partner.workloadBreakdown?.insa?.total || 0}</div>
                  <div><strong>${partner.workloadBreakdown?.insa?.completionRate || 0}%</strong></div>
                </td>
                <td class="text-center">
                  <div>${partner.workloadBreakdown?.both?.completed || 0}/${partner.workloadBreakdown?.both?.total || 0}</div>
                  <div><strong>${partner.workloadBreakdown?.both?.completionRate || 0}%</strong></div>
                </td>
                <td class="text-center"><strong>${Math.round(partner.completionRate || 0)}%</strong></td>
                <td class="text-center">${partner.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '';

    // Get the content without the partner analysis section
    const contentDiv = printRef.current.cloneNode(true);
    const partnerAnalysisSection = contentDiv.querySelector('.bg-white.rounded-lg.shadow-md.p-6:nth-child(3)');
    if (partnerAnalysisSection) {
      partnerAnalysisSection.remove();
    }
    const reportContent = contentDiv.innerHTML;
    
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
          ${partnerTableHtml}
          ${reportContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  if (!isOpen) return null;

  if (overallLoading || signedPartnersLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Loading Statistics...</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (overallError || signedPartnersError) {
    console.error('Statistics Error:', { overallError, signedPartnersError });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Statistics</div>
            <div className="text-gray-700 mb-4">
              {overallError?.response?.data?.message || 
               signedPartnersError?.response?.data?.message || 
               overallError?.message || 
               signedPartnersError?.message || 
               'Failed to load statistics'}
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

  if (!overallStats || !signedPartnersStats) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <div className="text-center">
            <div className="text-yellow-500 text-xl mb-4">⚠️ No Data Available</div>
            <div className="text-gray-700 mb-4">
              There are no partners or activities in the system yet.
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

  const renderWorkloadDistribution = (data) => {
    const chartData = {
      labels: ['Partner', 'INSA', 'Both'],
      datasets: [
        {
          label: 'Total Activities',
          data: [
            data.workloadDistribution.partner.total,
            data.workloadDistribution.insa.total,
            data.workloadDistribution.both.total
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
  };

  return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Workload Distribution</h3>
        <div className="h-64">
          <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {Object.entries(data.workloadDistribution).map(([key, value]) => (
            <div key={key} className="text-center">
              <p className="font-medium capitalize">{key}</p>
              <p className="text-2xl font-bold">{value.total}</p>
              <p className="text-sm text-gray-600">
                {value.completionRate}% completed
              </p>
              <p className="text-sm text-gray-600">
                Avg. {value.averagePerPartner} per partner
              </p>
            </div>
          ))}
                  </div>
                </div>
    );
  };

  const renderActivityStatus = (data) => {
    // Add null check and default value for activityStats
    const activityStats = data?.activities || {
      completed: 0,
      in_progress: 0,
      pending: 0,
      overdue: 0,
      upcoming: 0
    };

    const hasActivities = Object.values(activityStats).some(value => value > 0);

    if (!hasActivities) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Status Distribution</h3>
          <div className="text-center text-gray-500 py-8">
            No activities found
                  </div>
                </div>
      );
    }

    const chartData = {
      labels: ['Completed', 'In Progress', 'Pending', 'Overdue', 'Upcoming'],
      datasets: [
        {
          label: 'Activities',
          data: [
            activityStats.completed || 0,
            activityStats.in_progress || 0,
            activityStats.pending || 0,
            activityStats.overdue || 0,
            activityStats.upcoming || 0
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }
      ]
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Status Distribution</h3>
        <div className="h-64">
          <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="mt-4 grid grid-cols-5 gap-4">
          {Object.entries(activityStats).map(([key, value]) => (
            <div key={key} className="text-center">
              <p className="font-medium capitalize">{key.replace('_', ' ')}</p>
              <p className="text-2xl font-bold">{value || 0}</p>
            </div>
          ))}
                  </div>
                </div>
    );
  };

  const renderPartnerAnalysis = (data) => {
    if (!data.partnerDetailedAnalysis || data.partnerDetailedAnalysis.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Partner Analysis</h3>
          <div className="text-center text-gray-500 py-8">
            No partners found
              </div>
            </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Partner Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Activities</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner Tasks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INSA Tasks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Both Tasks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.partnerDetailedAnalysis.map((partner) => (
                <tr key={partner.partnerId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{partner.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{partner.partnershipType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.totalActivities}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.pending || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.in_progress || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.completed || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">{partner.workloadBreakdown?.partner?.completed || 0}/{partner.workloadBreakdown?.partner?.total || 0}</div>
                      <div className={getCompletionRateClass(partner.workloadBreakdown?.partner?.completionRate || 0)}>
                        {partner.workloadBreakdown?.partner?.completionRate || 0}%
                      </div>
                        </div>
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">{partner.workloadBreakdown?.insa?.completed || 0}/{partner.workloadBreakdown?.insa?.total || 0}</div>
                      <div className={getCompletionRateClass(partner.workloadBreakdown?.insa?.completionRate || 0)}>
                        {partner.workloadBreakdown?.insa?.completionRate || 0}%
                        </div>
                        </div>
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">{partner.workloadBreakdown?.both?.completed || 0}/{partner.workloadBreakdown?.both?.total || 0}</div>
                      <div className={getCompletionRateClass(partner.workloadBreakdown?.both?.completionRate || 0)}>
                        {partner.workloadBreakdown?.both?.completionRate || 0}%
                        </div>
                        </div>
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getCompletionRateClass(partner.completionRate)}>
                      {Math.round(partner.completionRate)}%
                    </span>
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{partner.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                </div>
    );
  };

  const renderInsights = (data) => {
    if (!data.insights || !data.insights.topPerformers || data.insights.topPerformers.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Insights</h3>
          <div className="text-center text-gray-500 py-8">
            No insights available
                </div>
                </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium mb-3">Top Performers</h4>
            <ul className="space-y-2">
              {data.insights.topPerformers.map((performer, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{performer.name}</span>
                  <span className={getCompletionRateClass(performer.completionRate)}>
                    {performer.completionRate}%
                  </span>
                </li>
              ))}
                  </ul>
                </div>
          <div>
            <h4 className="text-md font-medium mb-3">Areas Needing Improvement</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Partners Below 50% Completion</span>
                <span className="text-red-600 font-bold">{data.insights.needsImprovement}</span>
                </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Average Completion Rate</span>
                <span className={getCompletionRateClass(data.insights.averageCompletionRate)}>
                  {data.insights.averageCompletionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = (data) => {
    // Check if data exists and has the required properties
    if (!data || !data.partnerDetailedAnalysis) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="text-center text-gray-500 py-8">
            No data available
          </div>
        </div>
      );
    }

    // Calculate statistics from partnerDetailedAnalysis
    const partners = data.partnerDetailedAnalysis;
    const totalPartners = partners.length;
    const signedPartners = partners.filter(p => p.isSigned).length;
    const totalActivities = partners.reduce((sum, partner) => sum + (partner.totalActivities || 0), 0);

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-gray-500 mb-1">Total Partners</p>
            <p className="text-3xl font-bold text-gray-900">{totalPartners}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 mb-1">Signed Partners</p>
            <p className="text-3xl font-bold text-gray-900">{signedPartners}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 mb-1">Total Activities</p>
            <p className="text-3xl font-bold text-gray-900">{totalActivities}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Partnership Statistics</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={generateReport}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FaFileDownload className="mr-2" />
              Download Report
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="space-y-6">
          {renderOverview(overallStats)}
          {renderActivityStatus(overallStats)}
          {renderPartnerAnalysis(overallStats)}
          {renderInsights(overallStats)}
        </div>
      </div>
    </div>
  );
};

export default OverallStatisticsModal; 