import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewedRequests } from "../../api/adminApi";
import { format } from "date-fns";
import {
  FaBuilding,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaInfoCircle,
  FaPaperclip,
  FaUserShield,
  FaDownload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BACKEND_BASE_URL = "http://localhost:5000";

const ReviewedByYou = () => {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ["myReviewedRequests"],
    queryFn: fetchReviewedRequests,
  });

  const navigate = useNavigate();

  let currentAdminId = "";
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentAdminId = payload.id;
    }
  } catch (err) {
    console.error("Failed to decode token:", err);
  }

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

  if (isLoading)
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#3c8dbc]" />
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 max-w-3xl mx-auto">
        <div className="flex">
          <FaTimesCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm text-red-700">
            Error loading reviewed requests: {error.message}
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Your Reviewed Requests</h1>
        <p className="text-sm text-gray-600">
          A summary of the partnership requests you have reviewed, including your feedback and attachments.
        </p>
      </div>

      {requests?.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <FaInfoCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-3 text-lg font-medium text-gray-900">No reviewed requests</h3>
          <p className="mt-2 text-sm text-gray-500">You haven't reviewed any partnership requests yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => {
            const myApproval = req.approvals.find(
              (a) => a.approvedBy?._id === currentAdminId
            );
            if (!myApproval) return null;

            return (
              <div key={req._id} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{req.companyDetails?.name}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2" />
                        {req.companyDetails?.email}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        req.type === 'internal' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {req.type === 'internal' ? 'Internal Request' : 'External Request'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(req.status)}
                    <div className="mt-1 flex items-center text-sm text-gray-700 justify-end">
                      {getDecisionIcon(myApproval.decision)}
                      <span className="capitalize">{myApproval.decision}</span>
                    </div>
                    {myApproval.date && (
                      <div className="text-xs text-gray-500">
                        {format(new Date(myApproval.date), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    )}
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => navigate(`/admin/reviewed-requests/${req._id}`)}
                  className="mt-4 text-[#3c8dbc] hover:text-[#2c6a8f] text-sm font-medium"
                >
                  View Full Details
                </button>

                {/* Your Admin Message */}
                {myApproval.message && (
                  <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-100">
                    <h4 className="text-sm font-medium text-blue-800 flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2">
                        ADMIN ONLY
                      </span>
                      Internal Notes
                    </h4>
                    <p className="mt-1 text-sm text-gray-700">{myApproval.message}</p>
                  </div>
                )}

                {/* Your Feedback Message (visible to user) */}
                {myApproval.feedbackMessage && (
                  <div className="bg-green-50 p-3 rounded-md mb-4 border border-green-100">
                    <h4 className="text-sm font-medium text-green-800 flex items-center">
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs mr-2">
                        USER VISIBLE
                      </span>
                      Feedback to Requester
                    </h4>
                    <p className="mt-1 text-sm text-gray-700">{myApproval.feedbackMessage}</p>
                  </div>
                )}

                {/* Framework Type */}
                {req.frameworkType && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Framework Type:</p>
                    <span className="inline-block bg-[#3c8dbc]/10 text-[#3c8dbc] text-xs font-medium px-2 py-1 rounded-full">
                      {req.frameworkType.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Partnership Type */}
                {req.partnershipRequestType && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Partnership Type:</p>
                    <span className="inline-block bg-[#3c8dbc]/10 text-[#3c8dbc] text-xs font-medium px-2 py-1 rounded-full capitalize">
                      {req.partnershipRequestType}
                    </span>
                  </div>
                )}

                {/* Admin-only Attachments */}
                {myApproval.attachments && myApproval.attachments.length > 0 && (
                  <div className="mb-4 bg-blue-50 p-3 rounded-md border border-blue-100">
                    <p className="text-sm font-medium text-blue-800 flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2">
                        ADMIN ONLY
                      </span>
                      Internal Attachments:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {myApproval.attachments.map((filename, idx) => {
                        const fileUrl = `${BACKEND_BASE_URL}/api/v1/files/${filename}`;
                        const displayName = typeof filename === 'string' ? filename.split('/').pop() : filename;
                        return (
                          <li key={idx} className="flex items-center bg-white p-2 rounded">
                            <FaPaperclip className="text-blue-500 mr-2" />
                            <span className="text-gray-600 flex-1 truncate">{displayName}</span>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="text-blue-600 hover:text-blue-800 ml-2"
                            >
                              <FaDownload />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* User Feedback Attachments */}
                {myApproval.feedbackAttachments && myApproval.feedbackAttachments.length > 0 && (
                  <div className="mb-4 bg-green-50 p-3 rounded-md border border-green-100">
                    <p className="text-sm font-medium text-green-800 flex items-center mb-2">
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs mr-2">
                        USER VISIBLE
                      </span>
                      Feedback Attachments:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {myApproval.feedbackAttachments.map((filename, idx) => {
                        const fileUrl = `${BACKEND_BASE_URL}/api/v1/files/${filename}`;
                        const displayName = typeof filename === 'string' ? filename.split('/').pop() : filename;
                        return (
                          <li key={idx} className="flex items-center bg-white p-2 rounded">
                            <FaPaperclip className="text-green-500 mr-2" />
                            <span className="text-gray-600 flex-1 truncate">{displayName}</span>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="text-green-600 hover:text-green-800 ml-2"
                            >
                              <FaDownload />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Review History */}
                {req.approvals?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Review History:</h4>
                    <ul className="space-y-3">
                      {req.approvals.map((approval, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="flex items-center">
                                <FaUserShield className="text-gray-400 mr-1" />
                                <span className="font-medium">
                                  {approval.approvedBy?.name || "Unknown Admin"}
                                </span>{" "}
                                — <span className="capitalize">{approval.decision}</span>
                              </p>
                              
                              {/* Admin Message */}
                              {approval.message && (
                                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                                  <div className="flex items-center mb-1">
                                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                                      ADMIN ONLY
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-xs">{approval.message}</p>
                                  
                                  {/* Admin Attachments */}
                                  {approval.attachments && approval.attachments.length > 0 && (
                                    <div className="mt-1 pt-1 border-t border-blue-100">
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {approval.attachments.map((file, fileIdx) => {
                                          const fileName = typeof file === 'string' ? file.split('/').pop() : 'file';
                                          return (
                                            <span key={fileIdx} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">
                                              <FaPaperclip className="mr-1" size={10} />
                                              {fileName.length > 15 ? fileName.substring(0, 12) + '...' : fileName}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* User Feedback Message */}
                              {approval.feedbackMessage && (
                                <div className="mt-2 p-2 bg-green-50 rounded border border-green-100">
                                  <div className="flex items-center mb-1">
                                    <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs">
                                      USER FEEDBACK
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-xs">{approval.feedbackMessage}</p>
                                  
                                  {/* Feedback Attachments */}
                                  {approval.feedbackAttachments && approval.feedbackAttachments.length > 0 && (
                                    <div className="mt-1 pt-1 border-t border-green-100">
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {approval.feedbackAttachments.map((file, fileIdx) => {
                                          const fileName = typeof file === 'string' ? file.split('/').pop() : 'file';
                                          return (
                                            <span key={fileIdx} className="inline-flex items-center bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                                              <FaPaperclip className="mr-1" size={10} />
                                              {fileName.length > 15 ? fileName.substring(0, 12) + '...' : fileName}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 text-right">
                              {approval.date &&
                                format(new Date(approval.date), "MMM d, yyyy h:mm a")}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewedByYou;
