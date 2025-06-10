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
    const reportContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Activity Report - ${partner.companyName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3c8dbc; padding-bottom: 20px; }
            .company-name { color: #3c8dbc; font-size: 24px; font-weight: bold; }
            .report-date { color: #666; font-size: 14px; }
            .section { margin: 20px 0; }
            .section-title { color: #3c8dbc; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .activity { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .activity-title { font-weight: bold; color: #333; }
            .activity-meta { color: #666; font-size: 12px; margin: 5px 0; }
            .status { padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-in_progress { background: #dbeafe; color: #1e40af; }
            .status-completed { background: #d1fae5; color: #065f46; }
            .assignee { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
            .assignee-partner { background: #f3e8ff; color: #7c3aed; }
            .assignee-insa { background: #ecfccb; color: #365314; }
            .assignee-both { background: #fef3c7; color: #92400e; }
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
            <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>
          </div>
          ${reportContent}
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

  // Categorize activities
  const categorizedActivities = {
    pending: activities?.filter(a => a.status === 'pending') || [],
    in_progress: activities?.filter(a => a.status === 'in_progress') || [],
    completed: activities?.filter(a => a.status === 'completed') || [],
    byAssignee: {
      partner: activities?.filter(a => a.assignedTo === 'partner') || [],
      insa: activities?.filter(a => a.assignedTo === 'insa') || [],
      both: activities?.filter(a => a.assignedTo === 'both') || []
    }
  };

  const totalActivities = activities?.length || 0;

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

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-[#3c8dbc]">{totalActivities}</div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{categorizedActivities.pending.length}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{categorizedActivities.in_progress.length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{categorizedActivities.completed.length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Printable Report Content */}
      <div ref={printRef}>
        {/* Summary Section */}
        <div className="summary">
          <div className="section-title">Activity Summary</div>
          <div className="summary-item">
            <div className="summary-number">{totalActivities}</div>
            <div className="summary-label">Total Activities</div>
          </div>
          <div className="summary-item">
            <div className="summary-number">{categorizedActivities.pending.length}</div>
            <div className="summary-label">Pending</div>
          </div>
          <div className="summary-item">
            <div className="summary-number">{categorizedActivities.in_progress.length}</div>
            <div className="summary-label">In Progress</div>
          </div>
          <div className="summary-item">
            <div className="summary-number">{categorizedActivities.completed.length}</div>
            <div className="summary-label">Completed</div>
          </div>
        </div>

        {/* Activities by Status */}
        {['pending', 'in_progress', 'completed'].map(status => (
          <div key={status} className="section">
            <div className="section-title">
              {status.replace('_', ' ').toUpperCase()} Activities ({categorizedActivities[status].length})
            </div>
            {categorizedActivities[status].length === 0 ? (
              <p className="text-gray-500 italic">No {status.replace('_', ' ')} activities</p>
            ) : (
              categorizedActivities[status].map(activity => (
                <div key={activity._id} className="activity">
                  <div className="activity-title">{activity.title}</div>
                  <p className="text-gray-600 mt-2">{activity.description}</p>
                  <div className="activity-meta">
                    <span className={`status status-${activity.status}`}>
                      {activity.status.replace('_', ' ')}
                    </span>
                    <span className={`assignee assignee-${activity.assignedTo} ml-2`}>
                      {activity.assignedTo === 'both' ? 'Partner & INSA' : activity.assignedTo.toUpperCase()}
                    </span>
                    <span className="ml-2">
                      Deadline: {new Date(activity.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}

        {/* Activities by Assignee */}
        <div className="section">
          <div className="section-title">Activities by Assignee</div>
          {Object.entries(categorizedActivities.byAssignee).map(([assignee, activityList]) => (
            <div key={assignee} className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                {assignee === 'both' ? 'Partner & INSA' : assignee.toUpperCase()} ({activityList.length})
              </h4>
              {activityList.length === 0 ? (
                <p className="text-gray-500 italic ml-4">No activities assigned</p>
              ) : (
                activityList.map(activity => (
                  <div key={activity._id} className="activity ml-4">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-meta">
                      <span className={`status status-${activity.status}`}>
                        {activity.status.replace('_', ' ')}
                      </span>
                      <span className="ml-2">
                        Deadline: {new Date(activity.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Activities Table (not printed) */}
      <div className="no-print mt-8">
        <h4 className="text-lg font-semibold mb-4">Manage Activities</h4>
        {totalActivities === 0 ? (
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