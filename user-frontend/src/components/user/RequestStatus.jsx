import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  ChevronRightIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

const RequestStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const navigate = useNavigate();
  const { requestId } = useParams();

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

        if (response.data.status === 'success') {
          const requestsData = response.data.data.requests || [];
          setRequests(requestsData);
          
          // If there's a requestId in the URL, find and select that request
          if (requestId) {
            const request = requestsData.find(req => req._id === requestId);
            if (request) {
              setSelectedRequest(request);
            } else {
              toast.error('Request not found');
              navigate('/user/requests');
            }
          }

          if (requestsData.length === 0) {
            setError('No requests found');
          }
        } else {
          setError('No requests found');
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
  }, [navigate, requestId]);

  const getStatusColor = (status) => {
    // Normalize the status text for comparison
    const normalizedStatus = status?.toLowerCase().trim();
    switch (normalizedStatus) {
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

  const getStatusIcon = (status) => {
    // Normalize the status text for comparison
    const normalizedStatus = status?.toLowerCase().trim();
    switch (normalizedStatus) {
      case 'approved':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'disapproved':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case 'in review':
        return <DocumentCheckIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <DocumentCheckIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRequestClick = (request) => {
    navigate(`/user/requests/${request._id}`);
  };

  const handleDeleteRequest = (requestId) => {
    setRequestToDelete(requestId);
    setShowDeleteModal(true);
  };

  const confirmDeleteRequest = async () => {
    if (!requestToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to delete request');
        navigate('/login');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/v1/user/requests/${requestToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        toast.success('Request deleted successfully');
        
        // If we're in detail view, navigate back to list
        if (selectedRequest && selectedRequest._id === requestToDelete) {
          navigate('/user/requests');
        } else {
          // If we're in list view, refresh the list
          setRequests(requests.filter(req => req._id !== requestToDelete));
        }
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
      setRequestToDelete(null);
    }
  };

  const cancelDeleteRequest = () => {
    setShowDeleteModal(false);
    setRequestToDelete(null);
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
            onClick={() => navigate('/user/request')}
            className="px-6 py-3 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300"
          >
            Submit a Request
          </button>
        </div>
      </div>
    );
  }

  // If we have a requestId and selectedRequest, show the detail view
  if (requestId && selectedRequest) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-8 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/user/requests')}
              className="flex items-center text-[#3c8dbc] hover:text-[#2c6a8f] transition-colors duration-300 group"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Requests
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Request Details</h1>
              {selectedRequest?.status?.toLowerCase().trim() === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/user/requests/${selectedRequest._id}/edit`)}
                    className="flex items-center px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors duration-300 group"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit Request
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(selectedRequest._id)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 group"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Delete Request
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-[#3c8dbc]/5 rounded-xl p-6 border border-[#3c8dbc]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#3c8dbc] font-medium">Request Status</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {selectedRequest.status}
                    </h3>
                  </div>
                  {getStatusIcon(selectedRequest.status)}
                </div>
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-[#3c8dbc]/5 rounded-xl p-6 border border-[#3c8dbc]/10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ClockIcon className="h-6 w-6 mr-2 text-[#3c8dbc]" />
                  Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <CalendarIcon className="h-6 w-6 text-[#3c8dbc]" />
                    <div>
                      <p className="font-medium text-gray-900">Submitted</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedRequest.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <ClockIcon className="h-6 w-6 text-[#3c8dbc]" />
                    <div>
                      <p className="font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-600">
                        {selectedRequest.updatedAt ? formatDate(selectedRequest.updatedAt) : 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Framework Details */}
              <div className="bg-[#3c8dbc]/5 rounded-xl p-6 border border-[#3c8dbc]/10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <DocumentCheckIcon className="h-6 w-6 mr-2 text-[#3c8dbc]" />
                  Framework Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#3c8dbc] font-medium">Type</p>
                    <p className="font-medium text-gray-900">{selectedRequest.frameworkType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#3c8dbc] font-medium">Duration</p>
                    <p className="font-medium text-gray-900">
                      {selectedRequest.duration?.value} {selectedRequest.duration?.type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-[#3c8dbc]/5 rounded-xl p-6 border border-[#3c8dbc]/10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <BuildingOfficeIcon className="h-6 w-6 mr-2 text-[#3c8dbc]" />
                  Company Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#3c8dbc] font-medium">Company Name</p>
                    <p className="font-medium text-gray-900">{selectedRequest.companyDetails?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#3c8dbc] font-medium">Company Type</p>
                    <p className="font-medium text-gray-900">{selectedRequest.companyDetails?.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#3c8dbc] font-medium">Email</p>
                    <p className="font-medium text-gray-900">{selectedRequest.companyDetails?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#3c8dbc] font-medium">Address</p>
                    <p className="font-medium text-gray-900">{selectedRequest.companyDetails?.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
            <div className="mt-6 bg-[#3c8dbc]/5 rounded-xl p-6 border border-[#3c8dbc]/10">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <DocumentIcon className="h-6 w-6 mr-2 text-[#3c8dbc]" />
                Attached Documents
              </h2>
              <div className="space-y-4">
                {selectedRequest.attachments.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-[#3c8dbc]/20 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <DocumentIcon className="h-8 w-8 text-[#3c8dbc]" />
                      <div>
                        <p className="font-medium text-gray-900">{file.originalName}</p>
                        <p className="text-sm text-gray-600">
                          Uploaded on {formatDate(file.uploadedAt)}
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
                      className="p-2 text-[#3c8dbc] hover:text-[#2c6a8f] hover:bg-[#3c8dbc]/5 rounded-lg transition-all duration-200"
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
  }

  // List view
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/user')}
            className="flex items-center text-[#3c8dbc] hover:text-[#2c6a8f] transition-colors duration-300 group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Requests</h1>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#3c8dbc]">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Framework Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr 
                    key={request._id}
                    className="hover:bg-[#3c8dbc]/5 transition-all duration-200 cursor-pointer"
                    onClick={() => handleRequestClick(request)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(request.status)}
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.frameworkType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.companyDetails?.name}</div>
                      <div className="text-sm text-gray-500">{request.companyDetails?.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.duration?.value} {request.duration?.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {request.status?.toLowerCase().trim() === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/user/requests/${request._id}/edit`);
                              }}
                              className="p-2 text-[#3c8dbc] hover:text-[#2c6a8f] hover:bg-[#3c8dbc]/5 rounded-lg transition-all duration-200"
                              title="Edit request"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRequest(request._id);
                              }}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete request"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <ChevronRightIcon className="h-5 w-5 text-[#3c8dbc]" />
                      </div>
                    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

export default RequestStatus;
