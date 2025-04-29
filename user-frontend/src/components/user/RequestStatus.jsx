import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  DocumentIcon, 
  CalendarIcon, 
  BuildingOfficeIcon, 
  ArrowLeftIcon, 
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/outline";

const RequestStatus = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view request status');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/v1/user/requests/status', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status === 'success' && response.data.data.request) {
          setRequest(response.data.data.request);
        } else {
          setError('No request found');
        }
      } catch (error) {
        console.error('Error fetching request status:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again');
          navigate('/login');
        } else {
          setError(error.response?.data?.message || 'Failed to fetch request status');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequestStatus();
  }, [navigate]);

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
            onClick={() => navigate('/user/request')}
            className="px-6 py-3 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300"
          >
            Submit a Request
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <DocumentCheckIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/user')}
            className="flex items-center text-[#3c8dbc] hover:text-[#2c6a8f] transition-colors duration-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Request Details</h1>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Request Status</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </h3>
            </div>
            {getStatusIcon(request.status)}
          </div>
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="h-6 w-6 text-[#3c8dbc]" />
                <div>
                  <p className="font-medium text-gray-900">Submitted</p>
                  <p className="text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ClockIcon className="h-6 w-6 text-[#3c8dbc]" />
                <div>
                  <p className="font-medium text-gray-900">Last Updated</p>
                  <p className="text-sm text-gray-600">
                    {request?.updatedAt ? new Date(request.updatedAt).toLocaleString() : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Framework Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Framework Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900">{request.frameworkType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium text-gray-900">{request.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <BuildingOfficeIcon className="h-6 w-6 mr-2 text-[#3c8dbc]" />
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Company Name</p>
              <p className="font-medium text-gray-900">{request.companyDetails?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Company Type</p>
              <p className="font-medium text-gray-900">{request.companyDetails?.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{request.companyDetails?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900">{request.companyDetails?.address}</p>
            </div>
          </div>
        </div>

        {/* Attachments */}
        {request.attachments && request.attachments.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <DocumentIcon className="h-6 w-6 mr-2 text-[#3c8dbc]" />
              Attached Documents
            </h2>
            <div className="space-y-4">
              {request.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <DocumentIcon className="h-8 w-8 text-[#3c8dbc]" />
                    <div>
                      <p className="font-medium text-gray-900">{file.originalName}</p>
                      <p className="text-sm text-gray-600">
                        Uploaded on {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      const fileName = file.path.split('/').pop();
                      link.href = `http://localhost:5000/public/uploads/${fileName}`;
                      link.download = file.originalName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="p-2 text-[#3c8dbc] hover:text-[#2c6a8f] transition-colors duration-200"
                    title="Download file"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RequestStatus;
