import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewedRequestById } from "../../api/adminApi";
import { format, parseISO } from "date-fns";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileAlt,
  FaDownload,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowLeft,
  FaFileUpload
} from 'react-icons/fa';

const ReviewedRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: request, isLoading, error } = useQuery({
    queryKey: ["reviewedRequest", id],
    queryFn: () => fetchReviewedRequestById(id)
  });

  // Add console logging to debug date fields
  React.useEffect(() => {
    if (request) {
      console.log('Request data:', request);
      console.log('Created at:', request.createdAt);
      console.log('Approvals:', request.approvals);
      console.log('Attachments:', request.attachments);
    }
  }, [request]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Try parsing as ISO string first
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      try {
        // If that fails, try parsing as regular date
        return format(new Date(dateString), 'PPP');
      } catch (error) {
        console.error('Date parsing error:', error);
        return 'Invalid Date';
      }
    }
  };

  if (isLoading) {
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
          <span className="block sm:inline ml-2">
            {error.message || "Something went wrong."}
          </span>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status.toLowerCase()) {
      case "approved":
        return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
      case "disapproved":
        return <span className={`${base} bg-red-100 text-red-800`}>Disapproved</span>;
      case "pending":
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case "in review":
        return <span className={`${base} bg-blue-100 text-blue-800`}>In Review</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const getDecisionIcon = (decision) => {
    switch (decision) {
      case "approve":
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case "disapprove":
        return <FaTimesCircle className="text-red-500 mr-2" />;
      default:
        return <FaClock className="text-yellow-500 mr-2" />;
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-6 bg-gray-100">
      <div className="w-full max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/reviewed-requests")}
          className="flex items-center text-[#3c8dbc] hover:text-[#2c6a8f] mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Reviewed Requests
        </button>

        {/* Header Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#3c8dbc] mb-1">{request.companyDetails?.name}</h1>
              <div className="flex items-center space-x-3 text-gray-600 text-sm">
                <span className="flex items-center">
                  <FaBuilding className="mr-1" />
                  {request.companyDetails?.type}
                </span>
                <span className="flex items-center">
                  <FaEnvelope className="mr-1" />
                  {request.companyDetails?.email}
                </span>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(request.status)}
              <div className="mt-2 text-sm text-gray-600">
                {/* Remove Requested on date */}
              </div>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <FaBuilding className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Company Type:</span> {request.companyDetails?.type}
              </p>
              <p className="flex items-center text-gray-600">
                <FaEnvelope className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Email:</span> {request.companyDetails?.email}
              </p>
              <p className="flex items-center text-gray-600">
                <FaPhone className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Phone:</span> {request.companyDetails?.phone}
              </p>
              <p className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Address:</span> {request.companyDetails?.address}
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <FaFileAlt className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Framework Type:</span> {request.frameworkType}
              </p>
              {request.partnershipRequestType && (
                <p className="flex items-center text-gray-600">
                  <FaFileAlt className="mr-2 text-[#3c8dbc]" />
                  <span className="font-medium">Partnership Type:</span> 
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-[#3c8dbc]/10 text-[#3c8dbc] capitalize">
                    {request.partnershipRequestType}
                  </span>
                </p>
              )}
              <p className="flex items-center text-gray-600">
                <FaClock className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Duration:</span> {request.duration?.value} {request.duration?.type}
              </p>
            </div>
          </div>
        </div>

        {/* Review History */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Review History</h2>
          <div className="space-y-6">
            {request.approvals?.map((approval, index) => (
              <div key={index} className="border-l-4 border-[#3c8dbc] pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <FaUserShield className="text-[#3c8dbc] mr-2" />
                      <span className="font-medium">{approval.approvedBy?.name}</span>
                      <span className="mx-2">—</span>
                      <span className="capitalize">{approval.stage}</span>
                    </div>
                    <div className="mt-2 flex items-center">
                      {getDecisionIcon(approval.decision)}
                      <span className="capitalize">{approval.decision}</span>
                    </div>
                    {approval.message && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Internal Notes:</span> {approval.message}
                      </div>
                    )}
                    {approval.feedbackMessage && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Feedback to Requester:</span> {approval.feedbackMessage}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {/* Remove approval date */}
                  </div>
                </div>

                {/* Attachments */}
                {approval.attachments?.map((attachment, index) => {
                  const fileName = typeof attachment === 'string' 
                    ? attachment.split(/[/\\]/).pop()
                    : attachment.path.split(/[/\\]/).pop();
                  
                  return (
                    <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <FaFileUpload className="text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {typeof attachment === 'string' ? fileName : (attachment.originalName || fileName || 'Unnamed file')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {/* Remove attachment date */}
                        </p>
                      </div>
                      <a
                        href={`http://localhost:5000/api/v1/files/${fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaDownload />
                      </a>
                    </div>
                  );
                })}

                {/* Feedback Attachments */}
                {approval.feedbackAttachments?.map((attachment, index) => {
                  const fileName = typeof attachment === 'string' 
                    ? attachment.split(/[/\\]/).pop()
                    : attachment.path.split(/[/\\]/).pop();
                  
                  return (
                    <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <FaFileUpload className="text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {typeof attachment === 'string' ? fileName : (attachment.originalName || fileName || 'Unnamed file')}
                        </p>
                      </div>
                      <a
                        href={`http://localhost:5000/api/v1/files/${fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaDownload />
                      </a>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewedRequestDetail; 