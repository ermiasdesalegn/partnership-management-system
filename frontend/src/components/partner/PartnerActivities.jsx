import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaPlus, FaFileUpload, FaTrash, FaCheck, FaClock, FaSpinner, FaDownload, FaChartBar, FaCalendarAlt, FaExclamationTriangle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { fetchCurrentAdmin } from "../../api/adminApi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const API_BASE_URL = "http://localhost:5000";

const DeleteConfirmationModal = ({ isOpen, onClose, activity, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
        <div className="relative">
          {/* Modal Header with Warning Gradient */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-t-2xl p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FaExclamationCircle className="text-white text-2xl" />
                <h2 className="text-xl font-bold text-white">Delete Activity</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-medium mb-2">Are you sure you want to delete this activity?</p>
                <p className="text-red-600 text-sm">This action cannot be undone.</p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Activity Title</p>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-900 capitalize">{activity.status}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium text-gray-900">
                    {new Date(activity.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Deleting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaTrash className="mr-2" />
                    Delete Activity
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PartnerActivities = ({ partnerId, canManageActivities }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get current admin data
  const { data: adminData } = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: fetchCurrentAdmin
  });

  // Check if admin has permission to view activities
  const hasPermission = adminData?.role === "general-director" || adminData?.role === "partnership-division" || adminData?.role === "director";

  // If admin doesn't have permission, show message
  if (!hasPermission) {
    return (
      <div className="w-full min-h-screen px-8 py-10 bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
            <p className="text-gray-600">
              Only General Director, Partnership Division, and Director can view partner activities.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get auth token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Delete activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId) => {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/partnership-activities/activities/${activityId}`,
        {
          ...getAuthHeader(),
          withCredentials: true
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["partnerActivities", partnerId]);
      queryClient.invalidateQueries(["partnerActivityStats", partnerId]);
      toast.success("Activity deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete activity");
    }
  });

  // Fetch partner details
  const { data: partner } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/partners/${partnerId}`,
          {
            ...getAuthHeader(),
            withCredentials: true
          }
        );
        return response.data.data;
      } catch (error) {
        console.error("Error fetching partner:", error);
        return null;
      }
    }
  });

  // Fetch activities
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["partnerActivities", partnerId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/partnership-activities/${partnerId}/activities`,
          {
            ...getAuthHeader(),
            withCredentials: true
          }
        );
        return response.data.data || [];
      } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
      }
    }
  });

  // Fetch statistics
  const { data: stats = { total: 0, pending: 0, in_progress: 0, completed: 0, upcomingDeadlines: [] } } = useQuery({
    queryKey: ["partnerActivityStats", partnerId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/partnership-activities/${partnerId}/statistics`,
          {
            ...getAuthHeader(),
            withCredentials: true
          }
        );
        return response.data.data || {
          total: 0,
          pending: 0,
          in_progress: 0,
          completed: 0,
          upcomingDeadlines: []
        };
      } catch (error) {
        console.error("Error fetching statistics:", error);
        return {
          total: 0,
          pending: 0,
          in_progress: 0,
          completed: 0,
          upcomingDeadlines: []
        };
      }
    }
  });

  // Create activity mutation
  const createActivityMutation = useMutation({
    mutationFn: async (newActivity) => {
      if (!partner?.isSigned) {
        throw new Error("Cannot create activities for unsigned partners");
      }

      console.log("Partner data:", partner);
      console.log("Signed date:", partner.signedAt);
      console.log("Duration:", partner.requestRef?.duration);

      // Calculate deadline based on signed date and duration
      const signedDate = new Date(partner.signedAt);
      const duration = partner.requestRef?.duration;
      
      if (!duration) {
        throw new Error("Partner duration not found");
      }

      const deadline = new Date(signedDate);
      console.log("Initial deadline:", deadline);

      // Handle both object and number duration formats
      if (typeof duration === 'object' && duration.type) {
        if (duration.type === "months") {
          deadline.setMonth(deadline.getMonth() + parseInt(duration.value));
        } else {
          deadline.setFullYear(deadline.getFullYear() + parseInt(duration.value));
        }
      } else {
        // If duration is a number, assume it's years
        deadline.setFullYear(deadline.getFullYear() + parseInt(duration));
      }

      console.log("Final deadline:", deadline);
      console.log("Deadline ISO string:", deadline.toISOString());

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/partnership-activities/${partnerId}/activities`,
          {
            ...newActivity,
            deadline: deadline.toISOString()
          },
          {
            ...getAuthHeader(),
            withCredentials: true
          }
        );
        console.log("API Response:", response.data);
        return response.data.data;
      } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["partnerActivities", partnerId]);
      queryClient.invalidateQueries(["partnerActivityStats", partnerId]);
      setIsModalOpen(false);
      toast.success("Activity created successfully");
    },
    onError: (error) => {
      console.error("Mutation Error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to create activity");
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ activityId, status }) => {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/partnership-activities/activities/${activityId}/status`,
        { status },
        {
          ...getAuthHeader(),
          withCredentials: true
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["partnerActivities", partnerId]);
      queryClient.invalidateQueries(["partnerActivityStats", partnerId]);
      toast.success("Activity status updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  });

  // Upload attachment mutation
  const uploadAttachmentMutation = useMutation({
    mutationFn: async ({ activityId, file, description }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/partnership-activities/activities/${activityId}/attachments`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            ...getAuthHeader().headers
          },
          withCredentials: true
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["partnerActivities", partnerId]);
      setFile(null);
      setDescription("");
      toast.success("Attachment uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload attachment");
    }
  });

  const handleCreateActivity = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createActivityMutation.mutate({
      title: formData.get("title"),
      description: formData.get("description"),
      assignedTo: formData.get("assignedTo")
    });
  };

  const handleStatusUpdate = (activityId, newStatus) => {
    updateStatusMutation.mutate({ activityId, status: newStatus });
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!file || !selectedActivity) return;
    
    uploadAttachmentMutation.mutate({
      activityId: selectedActivity._id,
      file,
      description
    });
  };

  const handleDeleteActivity = (activityId) => {
    const activity = activities.find(a => a._id === activityId);
    setActivityToDelete(activity);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteActivityMutation.mutateAsync(activityToDelete._id);
      setDeleteModalOpen(false);
      setActivityToDelete(null);
    } catch (error) {
      console.error("Error deleting activity:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate statistics
  const calculateStats = (activities) => {
    const stats = {
      total: activities.length,
      completed: activities.filter(a => a.status === "completed").length,
      inProgress: activities.filter(a => a.status === "in_progress").length,
      pending: activities.filter(a => a.status === "pending").length,
      withAttachments: activities.filter(a => a.attachments?.length > 0).length,
      upcomingDeadlines: activities.filter(a => {
        const deadline = new Date(a.deadline);
        const today = new Date();
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && a.status !== "completed";
      }).length
    };

    return stats;
  };

  // Prepare chart data
  const prepareChartData = (activities) => {
    const stats = calculateStats(activities);

    // Status distribution chart
    const statusData = {
      labels: ['Completed', 'In Progress', 'Pending'],
      datasets: [{
        data: [stats.completed, stats.inProgress, stats.pending],
        backgroundColor: ['#10B981', '#F59E0B', '#6B7280'],
        borderColor: ['#059669', '#D97706', '#4B5563'],
        borderWidth: 1
      }]
    };

    // Monthly activity chart
    const monthlyData = activities.reduce((acc, activity) => {
      const month = new Date(activity.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const monthlyChartData = {
      labels: Object.keys(monthlyData),
      datasets: [{
        label: 'Activities Registered',
        data: Object.values(monthlyData),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1
      }]
    };

    return { statusData, monthlyChartData };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Activities</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.total || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.in_progress || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.completed || 0}</p>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Activity Status Distribution</h3>
            <FaChartBar className="text-blue-500" />
          </div>
          <div className="h-64">
            <Doughnut
              data={prepareChartData(activities).statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Activity</h3>
            <FaCalendarAlt className="text-blue-500" />
          </div>
          <div className="h-64">
            <Bar
              data={prepareChartData(activities).monthlyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Activities with Attachments</h3>
              <p className="text-2xl font-bold text-blue-600">{calculateStats(activities).withAttachments}</p>
            </div>
            <FaFileUpload className="text-blue-500 text-xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Upcoming Deadlines (7 days)</h3>
              <p className="text-2xl font-bold text-orange-600">{calculateStats(activities).upcomingDeadlines}</p>
            </div>
            <FaExclamationTriangle className="text-orange-500 text-xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
              <p className="text-2xl font-bold text-green-600">
                {activities.length > 0
                  ? `${Math.round((calculateStats(activities).completed / activities.length) * 100)}%`
                  : '0%'}
              </p>
            </div>
            <FaCheck className="text-green-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Only show create activity button for authorized roles */}
      {canManageActivities && (
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <FaPlus className="mr-2" />
        Create New Activity
      </button>
      )}

      {/* Activities List */}
      <div className="space-y-6">
        {activities?.map((activity) => (
          <div key={activity._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{activity.title}</h3>
                  <p className="text-gray-600 mt-1">{activity.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activity.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {activity.status === "completed" ? (
                      <span className="flex items-center">
                        <FaCheck className="mr-1" /> Completed
                      </span>
                    ) : activity.status === "in_progress" ? (
                      <span className="flex items-center">
                        <FaClock className="mr-1" /> In Progress
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaClock className="mr-1" /> Pending
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="font-medium text-gray-800 capitalize">{activity.assignedTo}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium text-gray-800">
                    {new Date(activity.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium text-gray-800">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Attachments Section */}
              {activity.attachments && activity.attachments.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activity.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <FaFileUpload className="text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {attachment.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(attachment.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <a
                          href={`${API_BASE_URL}/api/v1/files/${attachment.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaDownload />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Section */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {canManageActivities && activity.status !== "completed" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(activity._id, "in_progress")}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activity.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800 cursor-not-allowed"
                          : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      }`}
                      disabled={activity.status === "in_progress"}
                    >
                      <FaClock className="mr-2" />
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(activity._id, "completed")}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-800 cursor-not-allowed"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                      disabled={activity.status === "completed"}
                    >
                      <FaCheck className="mr-2" />
                      Mark Completed
                    </button>
                  </>
                )}
                {canManageActivities && (
                  <>
                <button
                  onClick={() => setSelectedActivity(activity)}
                  className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium"
                >
                  <FaFileUpload className="mr-2" />
                  Add Attachment
                </button>
                <button
                  onClick={() => handleDeleteActivity(activity._id)}
                  className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium"
                >
                  <FaTrash className="mr-2" />
                  Delete Activity
                </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Only show modals if user can manage activities */}
      {canManageActivities && (
        <>
      {/* Create Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all animate-slideUp">
            <div className="relative">
              {/* Modal Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Create New Activity</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleCreateActivity} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activity Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        placeholder="Enter activity title"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={4}
                        placeholder="Describe the activity details..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                      />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned To
                      </label>
                      <select
                        name="assignedTo"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      >
                        <option value="">Select assignee</option>
                        <option value="partner">Partner</option>
                        <option value="insa">INSA</option>
                        <option value="both">Both</option>
                      </select>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-blue-800">Automatic Deadline</h3>
                            <p className="mt-1 text-sm text-blue-600">
                              The deadline will be automatically set based on the partnership duration of{' '}
                              {typeof partner?.requestRef?.duration === 'object' 
                                ? `${partner.requestRef.duration.value} ${partner.requestRef.duration.type}`
                                : '3 years'}.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Create Activity
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Attachment Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
            <div className="relative">
              {/* Modal Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Add Attachment</h2>
                  <button
                    onClick={() => {
                      setSelectedActivity(null);
                      setFile(null);
                      setDescription("");
                    }}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-200 bg-gray-50 hover:bg-white">
                      <div className="space-y-1 text-center">
                        <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              onChange={(e) => setFile(e.target.files[0])}
                              className="sr-only"
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Any file up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description for this file"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedActivity(null);
                        setFile(null);
                        setDescription("");
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
          )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setActivityToDelete(null);
        }}
        activity={activityToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
        </>
      )}
    </div>
  );
};

export default PartnerActivities; 