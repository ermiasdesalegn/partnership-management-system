import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FaFileDownload, 
  FaEdit, 
  FaTrash, 
  FaUpload,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
  FaBuilding,
  FaUser,
  FaUsers,
  FaCalendarAlt,
  FaFileAlt,
  FaTimes
} from 'react-icons/fa';
import { 
  fetchPartnerActivities, 
  createPartnerActivity, 
  updateActivityStatus, 
  deleteActivity,
  uploadActivityAttachment 
} from '../../api/adminApi';
import { toast } from 'react-toastify';
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

const ActivityModal = ({ isOpen, onClose, partnerId, activity = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    description: activity?.description || '',
    assignedTo: activity?.assignedTo || 'partner'
  });

  const createMutation = useMutation({
    mutationFn: (data) => createPartnerActivity(partnerId, data),
    onSuccess: () => {
      toast.success('Activity created successfully');
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create activity');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    createMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {activity ? 'Edit Activity' : 'Create New Activity'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc]"
              placeholder="Enter activity title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc]"
              placeholder="Enter activity description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To *
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc]"
            >
              <option value="partner">Partner</option>
              <option value="insa">INSA</option>
              <option value="both">Both (Partner & INSA)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="px-4 py-2 bg-[#3c8dbc] text-white rounded-md hover:bg-[#2c6a8f] disabled:opacity-50"
            >
              {createMutation.isLoading ? 'Creating...' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ActivityReport = ({ partner }) => {
  const queryClient = useQueryClient();
  const printRef = useRef();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['partnerActivities', partner._id],
    queryFn: () => fetchPartnerActivities(partner._id),
    enabled: !!partner._id
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ activityId, status }) => updateActivityStatus(activityId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerActivities', partner._id]);
      toast.success('Activity status updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update activity status');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerActivities', partner._id]);
      toast.success('Activity deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete activity');
    }
  });

  const handleStatusUpdate = (activityId, newStatus) => {
    updateStatusMutation.mutate({ activityId, status: newStatus });
  };

  const handleDeleteActivity = (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      deleteMutation.mutate(activityId);
    }
  };

  const generateReport = () => {
    const printWindow = window.open('', '_blank');
    
    // Calculate statistics for charts
    const statusCounts = {
      pending: activities?.filter(a => a.status === 'pending').length || 0,
      in_progress: activities?.filter(a => a.status === 'in_progress').length || 0,
      completed: activities?.filter(a => a.status === 'completed').length || 0
    };

    const workloadCounts = {
      partner: activities?.filter(a => a.assignedTo === 'partner').length || 0,
      insa: activities?.filter(a => a.assignedTo === 'insa').length || 0,
      both: activities?.filter(a => a.assignedTo === 'both').length || 0
    };

    // Create chart images
    const statusChartImage = `
      <div class="chart-container">
        <h3 class="section-title">Activity Status Distribution</h3>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color" style="background: #fef3c7;"></span>
            <span>Pending: ${statusCounts.pending}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #dbeafe;"></span>
            <span>In Progress: ${statusCounts.in_progress}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #d1fae5;"></span>
            <span>Completed: ${statusCounts.completed}</span>
          </div>
        </div>
      </div>
    `;

    const workloadChartImage = `
      <div class="chart-container">
        <h3 class="section-title">Workload Distribution</h3>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color" style="background: #f3e8ff;"></span>
            <span>Partner: ${workloadCounts.partner}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #ecfccb;"></span>
            <span>INSA: ${workloadCounts.insa}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #fef3c7;"></span>
            <span>Both: ${workloadCounts.both}</span>
          </div>
        </div>
      </div>
    `;

    // Create activities table
    const activitiesTable = activities?.length ? `
      <div class="section">
        <h3 class="section-title">Activities Overview</h3>
        <table class="activity-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Deadline</th>
              <th>Attachments</th>
            </tr>
          </thead>
          <tbody>
            ${activities.map(activity => `
              <tr>
                <td>${activity.title}</td>
                <td>${activity.description}</td>
                <td>
                  <span class="status status-${activity.status}">
                    ${activity.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span class="assignee assignee-${activity.assignedTo}">
                    ${activity.assignedTo === 'both' ? 'Partner & INSA' : activity.assignedTo.toUpperCase()}
                  </span>
                </td>
                <td>${new Date(activity.deadline).toLocaleDateString()}</td>
                <td>${activity.attachments?.length || 0} files</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '<p class="text-center text-gray-500">No activities found</p>';

    printWindow.document.write(`
      <html>
        <head>
          <title>Activity Report - ${partner.companyName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3c8dbc; padding-bottom: 20px; }
            .company-name { color: #3c8dbc; font-size: 28px; font-weight: bold; }
            .report-subtitle { color: #666; font-size: 16px; margin-top: 5px; }
            .report-date { color: #666; font-size: 14px; margin-top: 10px; }
            .section { margin: 25px 0; page-break-inside: avoid; }
            .section-title { color: #3c8dbc; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #ddd; padding-bottom: 8px; }
            .activity-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .activity-table th, .activity-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .activity-table th { background-color: #f8f9fa; font-weight: bold; color: #333; }
            .status { padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-in_progress { background: #dbeafe; color: #1e40af; }
            .status-completed { background: #d1fae5; color: #065f46; }
            .assignee { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
            .assignee-partner { background: #f3e8ff; color: #7c3aed; }
            .assignee-insa { background: #ecfccb; color: #365314; }
            .assignee-both { background: #fef3c7; color: #92400e; }
            .chart-container { margin: 20px 0; text-align: center; }
            .chart-legend { display: flex; justify-content: center; gap: 20px; margin-top: 10px; }
            .legend-item { display: flex; align-items: center; gap: 5px; }
            .legend-color { width: 12px; height: 12px; border-radius: 2px; }
            .summary { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .summary-item { display: inline-block; margin: 10px 20px; text-align: center; }
            .summary-number { font-size: 24px; font-weight: bold; color: #3c8dbc; }
            .summary-label { font-size: 12px; color: #666; }
            @media print { 
              body { margin: 0; } 
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${partner.companyName} - Activity Report</div>
            <div class="report-subtitle">Comprehensive Analysis of Activities & Performance</div>
            <div class="report-date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          </div>

          <div class="summary">
            <div class="summary-item">
              <div class="summary-number">${activities?.length || 0}</div>
              <div class="summary-label">Total Activities</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${statusCounts.completed}</div>
              <div class="summary-label">Completed</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${statusCounts.in_progress}</div>
              <div class="summary-label">In Progress</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${statusCounts.pending}</div>
              <div class="summary-label">Pending</div>
            </div>
          </div>

          ${statusChartImage}
          ${workloadChartImage}
          ${activitiesTable}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="text-green-500" />;
      case 'in_progress': return <FaHourglassHalf className="text-blue-500" />;
      default: return <FaClock className="text-yellow-500" />;
    }
  };

  const getAssigneeIcon = (assignedTo) => {
    switch (assignedTo) {
      case 'partner': return <FaBuilding className="text-purple-500" />;
      case 'insa': return <FaUser className="text-green-500" />;
      default: return <FaUsers className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getAssigneeColor = (assignedTo) => {
    switch (assignedTo) {
      case 'partner': return 'bg-purple-100 text-purple-800';
      case 'insa': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3c8dbc]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading activities: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#3c8dbc] flex items-center">
          <FaFileAlt className="mr-2" />
          Activity Report - {partner.companyName}
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <FaFileDownload className="mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      <div ref={printRef} className="space-y-6">
        {/* Activity Status Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Status Distribution</h3>
          <div className="h-64">
            <Doughnut 
              data={{
                labels: ['Pending', 'In Progress', 'Completed'],
                datasets: [{
                  data: [
                    activities?.filter(a => a.status === 'pending').length || 0,
                    activities?.filter(a => a.status === 'in_progress').length || 0,
                    activities?.filter(a => a.status === 'completed').length || 0
                  ],
                  backgroundColor: [
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                  ],
                  borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                  ],
                  borderWidth: 1
                }]
              }} 
              options={{ maintainAspectRatio: false }} 
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {['pending', 'in_progress', 'completed'].map(status => (
              <div key={status} className="text-center">
                <p className="font-medium capitalize">{status.replace('_', ' ')}</p>
                <p className="text-2xl font-bold">
                  {activities?.filter(a => a.status === status).length || 0}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Workload Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Workload Distribution</h3>
          <div className="h-64">
            <Doughnut 
              data={{
                labels: ['Partner', 'INSA', 'Both'],
                datasets: [{
                  data: [
                    activities?.filter(a => a.assignedTo === 'partner').length || 0,
                    activities?.filter(a => a.assignedTo === 'insa').length || 0,
                    activities?.filter(a => a.assignedTo === 'both').length || 0
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
                }]
              }} 
              options={{ maintainAspectRatio: false }} 
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {['partner', 'insa', 'both'].map(assignee => (
              <div key={assignee} className="text-center">
                <p className="font-medium capitalize">{assignee}</p>
                <p className="text-2xl font-bold">
                  {activities?.filter(a => a.assignedTo === assignee).length || 0}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Activities Overview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities?.map((activity) => (
                  <tr key={activity._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{activity.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAssigneeColor(activity.assignedTo)}`}>
                        {activity.assignedTo === 'both' ? 'Partner & INSA' : activity.assignedTo.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.attachments?.length || 0} files
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Activities Table (not printed) */}
      <div className="no-print mt-8">
        <h4 className="text-lg font-semibold mb-4">Manage Activities</h4>
        {activities?.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No activities found. Create the first activity to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities?.map(activity => (
                  <tr key={activity._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                        <div className="text-sm text-gray-500">{activity.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAssigneeColor(activity.assignedTo)}`}>
                        {getAssigneeIcon(activity.assignedTo)}
                        <span className="ml-1">
                          {activity.assignedTo === 'both' ? 'Partner & INSA' : activity.assignedTo.toUpperCase()}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={activity.status}
                        onChange={(e) => handleStatusUpdate(activity._id, e.target.value)}
                        className={`text-xs rounded-full px-2 py-1 ${getStatusColor(activity.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {new Date(activity.deadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteActivity(activity._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityReport; 