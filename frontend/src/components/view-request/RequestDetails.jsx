import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRequest } from "../../api/adminApi";
import { format } from "date-fns";
import {
  FaBuilding,
  FaUser,
  FaFileAlt,
  FaGavel,
  FaClock,
  FaDownload,
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: request, isLoading, error } = useQuery({
    queryKey: ["requestDetails", id],
    queryFn: () => fetchRequest(id),
    retry: 1,
    onError: (error) => {
      console.error("Error fetching request:", error);
    }
  });

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
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <FaLock className="text-[#3c8dbc] text-4xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Access Restricted</h2>
          <p className="text-gray-600 text-center mb-6">
            {error.message === "You don't have permission to access this request" 
              ? "You don't have permission to view this request's details. Please contact your administrator if you believe this is an error."
              : "Something went wrong while fetching the request details. Please try again later."}
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/admin/request")}
              className="flex items-center px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Return to Requests List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="w-full px-8 py-10">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Request Not Found</h2>
          <p className="text-gray-600 text-center mb-6">
            The request you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/admin/request")}
              className="flex items-center px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Return to Requests List
            </button>
          </div>
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

  return (
    <div className="w-full min-h-screen px-4 py-10 bg-gray-100">
      <div className="w-full max-w-7xl mx-auto space-y-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/request")}
          className="flex items-center text-[#3c8dbc] hover:text-[#2c6a8f] mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to Requests
        </button>

        {/* Header Section */}
        <div className="bg-white shadow-lg rounded-lg p-10 mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#3c8dbc] mb-2">{request.companyDetails?.name}</h1>
              <div className="flex items-center space-x-6 text-gray-600 text-lg">
                <span className="flex items-center">
                  <FaBuilding className="mr-2" />
                  {request.companyDetails?.type}
                </span>
                <span className="flex items-center">
                  <FaEnvelope className="mr-2" />
                  {request.companyDetails?.email}
                </span>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(request.status)}
              <div className="mt-2 text-lg text-gray-600">
                Requested on: {format(new Date(request.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white shadow-lg rounded-lg p-10 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <p className="flex items-center text-gray-600 text-lg">
                <FaBuilding className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Company Type:</span> {request.companyDetails?.type}
              </p>
              <p className="flex items-center text-gray-600 text-lg">
                <FaEnvelope className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Email:</span> {request.companyDetails?.email}
              </p>
              <p className="flex items-center text-gray-600 text-lg">
                <FaPhone className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Phone:</span> {request.companyDetails?.phone}
              </p>
              <p className="flex items-center text-gray-600 text-lg">
                <FaMapMarkerAlt className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Address:</span> {request.companyDetails?.address}
              </p>
            </div>
            <div className="space-y-5">
              <p className="flex items-center text-gray-600 text-lg">
                <FaFileAlt className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Framework Type:</span> {request.frameworkType}
              </p>
              <p className="flex items-center text-gray-600 text-lg">
                <FaClock className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Duration:</span> {request.duration?.value} {request.duration?.type}
              </p>
              <p className="flex items-center text-gray-600 text-lg">
                <FaUser className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Requested By:</span> {request.userRef?.name}
              </p>
              <p className="flex items-center text-gray-600 text-lg">
                <FaGavel className="mr-2 text-[#3c8dbc]" />
                <span className="font-medium">Department:</span> {request.userRef?.department}
              </p>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        {request.attachments && request.attachments.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-10 mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Attachments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {request.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaFileAlt className="text-[#3c8dbc] mr-4 text-2xl" />
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      {attachment.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(attachment.uploadedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <a
                    href={`http://localhost:5000/api/v1/files/${attachment.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-gray-400 hover:text-gray-600 text-xl"
                  >
                    <FaDownload />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approval History */}
        {request.approvals && request.approvals.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-10 mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Approval History</h2>
            <div className="space-y-8">
              {request.approvals.map((approval, index) => (
                <div key={index} className="border-l-4 border-[#3c8dbc] pl-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <FaUser className="text-[#3c8dbc] mr-3 text-xl" />
                        <span className="font-medium text-lg">{approval.approvedBy?.name}</span>
                        <span className="mx-3">—</span>
                        <span className="capitalize text-lg">{approval.stage}</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        {approval.decision === "approve" ? (
                          <FaCheckCircle className="text-green-500 mr-2 text-lg" />
                        ) : (
                          <FaTimesCircle className="text-red-500 mr-2 text-lg" />
                        )}
                        <span className="capitalize text-lg">{approval.decision}</span>
                      </div>
                      {approval.message && (
                        <div className="mt-2 text-md text-gray-600">
                          <span className="font-medium">Notes:</span> {approval.message}
                        </div>
                      )}
                    </div>
                    <div className="text-md text-gray-500">
                      {format(new Date(approval.date), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetails; 