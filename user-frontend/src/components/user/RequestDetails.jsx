import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  DocumentCheckIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

const RequestDetails = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view request details');
          navigate('/login');
          return;
        }

        // First try the direct request endpoint
        let response = await axios.get(`http://localhost:5000/api/v1/user/requests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // If that fails, try the status endpoint and filter
        if (!response.data?.data?.request) {
          response = await axios.get('http://localhost:5000/api/v1/user/requests/status', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const requests = response.data.data.requests || [];
          const foundRequest = requests.find(req => req._id === id);
          
          if (foundRequest) {
            setRequest(foundRequest);
          } else {
            throw new Error('Request not found');
          }
        } else {
          setRequest(response.data.data.request);
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again');
          navigate('/login');
        } else {
          setError(error.response?.data?.message || 'Failed to fetch request details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, navigate]);

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
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
    if (!status) return <DocumentCheckIcon className="h-6 w-6 text-gray-500" />;
    
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

  const confirmDeleteRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to delete request');
        navigate('/login');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/v1/user/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        toast.success('Request deleted successfully');
        navigate('/user/profile');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Cannot delete this request');
      } else {
        toast.error('Failed to delete request. Please try again.');
      }
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteRequest = () => {
    setShowDeleteModal(false);
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
            onClick={() => navigate('/user/profile')}
            className="px-6 py-3 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Request Not Found</h2>
          <p className="text-gray-600 mb-6">The requested details could not be found.</p>
          <button
            onClick={() => navigate('/user/profile')}
            className="px-6 py-3 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate('/user/profile')}
            className="flex items-center text-[#3c8dbc] hover:text-[#2c6a8f] transition-colors duration-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Profile
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Request Details</h1>
            {request?.status?.toLowerCase().trim() === 'pending' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/user/requests/${request._id}/edit`)}
                  className="flex items-center px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300 group"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Request
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 group"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete Request
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Request Status</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Unknown'}
              </h3>
            </div>
            {getStatusIcon(request.status)}
          </div>
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
              {request.status || 'Unknown'}
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
                    {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ClockIcon className="h-6 w-6 text-[#3c8dbc]" />
                <div>
                  <p className="font-medium text-gray-900">Last Updated</p>
                  <p className="text-sm text-gray-600">
                    {request.updatedAt ? new Date(request.updatedAt).toLocaleString() : 'Not available'}
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
                <p className="font-medium text-gray-900">{request.frameworkType || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium text-gray-900">
                  {request.duration ? `${request.duration.value} ${request.duration.type}` : 'Not specified'}
                </p>
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
              <p className="font-medium text-gray-900">{request.companyDetails?.name || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Company Type</p>
              <p className="font-medium text-gray-900">{request.companyDetails?.type || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{request.companyDetails?.email || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900">{request.companyDetails?.address || 'Not specified'}</p>
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
                        Uploaded on {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      const fileName = file.path.includes('/') || file.path.includes('\\') 
                        ? file.path.split(/[/\\]/).pop() 
                        : file.path;
                      link.href = `http://localhost:5000/api/v1/files/${fileName}`;
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

        {/* Admin Reviews (User-Focused) */}
        {request.approvals && request.approvals.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <DocumentCheckIcon className="h-6 w-6 mr-2 text-[#3c8dbc]" />
              Admin Feedback
            </h2>
            <div className="space-y-6">
              {request.approvals.map((approval, index) => (
                <div key={index}>
                  {approval.feedbackMessage && (
                    <div className="mb-2">
                      <p className="text-gray-700">{approval.feedbackMessage}</p>
                    </div>
                  )}
                  {approval.feedbackAttachments && approval.feedbackAttachments.length > 0 && (
                    <div className="space-y-2">
                      {approval.feedbackAttachments.map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <DocumentIcon className="h-5 w-5 text-[#3c8dbc]" />
                            <span className="text-sm text-gray-600">{file}</span>
                          </div>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              const fileName = file.includes('/') || file.includes('\\') 
                                ? file.split(/[/\\]/).pop() 
                                : file;
                              link.href = `http://localhost:5000/api/v1/files/${fileName}`;
                              link.download = fileName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="p-1 text-[#3c8dbc] hover:text-[#2c6a8f] transition-colors duration-200"
                            title="Download file"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Minimalist Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden border border-gray-200"
            >
              {/* Modal Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <TrashIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Request</h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                    <TrashIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Delete this request?
                  </h4>
                  <p className="text-sm text-gray-500 mb-6">
                    This action cannot be undone. All files and data will be permanently removed.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex space-x-3 justify-end border-t border-gray-200">
                <button
                  onClick={cancelDeleteRequest}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteRequest}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RequestDetails; 