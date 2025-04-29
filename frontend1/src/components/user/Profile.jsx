import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  UserCircleIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowRightIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view profile');
          navigate('/login');
          return;
        }

        // Fetch user profile
        const userResponse = await axios.get('http://localhost:5000/api/v1/user/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (userResponse.data.status === 'success') {
          setUser(userResponse.data.data.user);
        }

        // Fetch all requests
        try {
          const requestsResponse = await axios.get('http://localhost:5000/api/v1/user/requests/status', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (requestsResponse.data.status === 'success') {
            setRequests(requestsResponse.data.data.requests || []);
          }
        } catch (requestError) {
          console.error('Error fetching requests:', requestError);
          setRequests([]);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again');
          navigate('/login');
        } else {
          setError(error.response?.data?.message || 'Failed to fetch profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <DocumentTextIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3c8dbc]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">Here's an overview of your account</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#3c8dbc]/10 rounded-full">
                <UserCircleIcon className="h-8 w-8 text-[#3c8dbc]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">Email: {user?.email}</p>
              <p className="text-sm text-gray-600">Role: {user?.role}</p>
            </div>
            <button
              onClick={() => navigate('/user/profile/edit')}
              className="mt-4 w-full px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300"
            >
              Edit Profile
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#3c8dbc]/10 rounded-full">
                <DocumentTextIcon className="h-8 w-8 text-[#3c8dbc]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <p className="text-sm text-gray-600">Common tasks</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate('/user/request')}
                className="w-full flex items-center justify-between px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300"
              >
                Submit New Request
                <PlusIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/user/howto')}
                className="w-full flex items-center justify-between px-4 py-2 bg-white text-[#3c8dbc] border border-[#3c8dbc] rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                How To Guide
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#3c8dbc]/10 rounded-full">
                <DocumentTextIcon className="h-8 w-8 text-[#3c8dbc]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Request Stats</h3>
                <p className="text-sm text-gray-600">Your request history</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">Total Requests: {requests.length}</p>
              <p className="text-sm text-gray-600">
                Pending: {requests.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">
                Approved: {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Requests</h2>
            <button
              onClick={() => navigate('/user/request')}
              className="flex items-center px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Request
            </button>
          </div>

          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  onClick={() => navigate(`/user/requests/${request._id}`)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.frameworkType} - {request.companyDetails?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Submitted on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't submitted any requests yet</p>
              <button
                onClick={() => navigate('/user/request')}
                className="px-6 py-3 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300"
              >
                Submit Your First Request
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
