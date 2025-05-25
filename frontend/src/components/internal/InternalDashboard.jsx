import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChartLine,
  FaBell,
  FaArrowRight
} from 'react-icons/fa';
import { fetchDashboardData } from '../../api/userApi';
import { toast } from 'react-toastify';

const InternalDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRequests: 0,
      pendingRequests: 0,
      completedRequests: 0,
      rejectedRequests: 0
    },
    recentRequests: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
        toast.error(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'disapproved':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#3c8dbc]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-8 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back! Here's an overview of your requests.</p>
        </div>
      </div>
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Requests Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{dashboardData.stats?.totalRequests || 0}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaFileAlt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending Requests Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{dashboardData.stats?.pendingRequests || 0}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <FaClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Completed Requests Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Requests</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{dashboardData.stats?.completedRequests || 0}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Rejected Requests Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Requests</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{dashboardData.stats?.rejectedRequests || 0}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <FaTimesCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Requests Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
              </div>
              <div className="p-6">
                {dashboardData.recentRequests?.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentRequests.map((request) => (
                      <div 
                        key={request._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/internal/requests/${request._id}`)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${getStatusColor(request.status)}`}>
                            {request.status === 'approved' ? (
                              <FaCheckCircle className="w-5 h-5" />
                            ) : request.status === 'disapproved' ? (
                              <FaTimesCircle className="w-5 h-5" />
                            ) : (
                              <FaClock className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{request.companyDetails?.name || 'Untitled Request'}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <FaArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent requests found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              </div>
              <div className="p-6">
                {dashboardData.notifications?.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.notifications.map((notification, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FaBell className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No notifications found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/internal/request')}
                className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FaFileAlt className="w-5 h-5" />
                <span>New Request</span>
              </button>
              <button
                onClick={() => navigate('/internal/requests')}
                className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaChartLine className="w-5 h-5" />
                <span>View All Requests</span>
              </button>
              <button
                onClick={() => navigate('/internal/profile')}
                className="flex items-center justify-center space-x-2 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <FaBell className="w-5 h-5" />
                <span>Update Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalDashboard;