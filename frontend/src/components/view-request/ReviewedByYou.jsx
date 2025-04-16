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
} from "react-icons/fa";

const BACKEND_BASE_URL = "http://localhost:5000";

const ReviewedByYou = () => {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ["myReviewedRequests"],
    queryFn: fetchReviewedRequests,
  });

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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
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
              <div key={req._id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaBuilding className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {req.companyDetails?.name || "Unnamed Company"}
                      </h3>
                      <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                        <span className="flex items-center">
                          <FaEnvelope className="mr-1" />
                          {req.companyDetails?.email || "No email"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>Current Stage: {req.currentStage || "N/A"}</span>
                      </div>
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

                {/* Your Message */}
                {myApproval.message && (
                  <div className="bg-blue-50 p-3 rounded-md mb-4">
                    <h4 className="text-sm font-medium text-blue-800">Your Comment</h4>
                    <p className="mt-1 text-sm text-blue-700">{myApproval.message}</p>
                  </div>
                )}

                {/* Framework Type */}
                {req.frameworkType && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Framework Type:</p>
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
                      {req.frameworkType.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Attached Files */}
                {myApproval.attachments && myApproval.attachments.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Attached Files:</p>
                    <ul className="space-y-1 text-sm text-blue-600 underline">
                      {myApproval.attachments.map((filename, idx) => {
                        const fileUrl = `${BACKEND_BASE_URL}/public/${filename}`;
                        return (
                          <li key={idx} className="flex items-center space-x-2">
                            <FaPaperclip className="text-gray-500" />
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="hover:text-blue-700"
                            >
                              {filename}
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
                              {approval.message && (
                                <p className="text-gray-600 mt-1">💬 {approval.message}</p>
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
