import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewedRequests } from "../../api/adminApi";
import { format } from "date-fns";
import { FaBuilding, FaEnvelope, FaCheckCircle, FaTimesCircle, FaClock, FaInfoCircle } from "react-icons/fa";

const ReviewedByYou = () => {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ["myReviewedRequests"],
    queryFn: fetchReviewedRequests,
  });

  if (isLoading) return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
  </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <FaTimesCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error loading reviewed requests: {error.message}</p>
        </div>
      </div>
    </div>
  );

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
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status.toLowerCase()) {
      case "approved":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
      case "disapproved":
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Disapproved</span>;
      case "pending":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case "in review":
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>In Review</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Reviewed Requests</h1>
          <p className="mt-2 text-sm text-gray-600">
            A list of all the partnership requests you've reviewed
          </p>
        </div>
      </div>

      {requests?.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <FaInfoCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No reviewed requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't reviewed any partnership requests yet.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {requests?.map((req) => {
              const myApproval = req.approvals.find(
                (a) => a.approvedBy === JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id
              );

              return (
                <li key={req._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaBuilding className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {req.companyDetails?.name || "Unnamed Company"}
                          </h3>
                          <span className="ml-2">
                            {getStatusBadge(req.status)}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-2">
                          <span className="flex items-center">
                            <FaEnvelope className="mr-1" />
                            {req.companyDetails?.email || "No email"}
                          </span>
                          <span>•</span>
                          <span>
                            Current stage: {req.currentStage || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="flex items-center">
                        {getDecisionIcon(myApproval?.decision)}
                        <span className="font-medium">
                          {myApproval?.decision ? 
                            myApproval.decision.charAt(0).toUpperCase() + myApproval.decision.slice(1) : 
                            "No decision"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {myApproval?.date ? 
                          format(new Date(myApproval.date), "MMM d, yyyy 'at' h:mm a") : 
                          "No date"}
                      </div>
                    </div>
                  </div>

                  {myApproval?.message && (
                    <div className="mt-4 bg-blue-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-blue-800">Your review comment:</h4>
                      <p className="mt-1 text-sm text-blue-700">{myApproval.message}</p>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Requested by:</p>
                      <p className="font-medium">
                        {req.userRef?.name || "Unknown"} ({req.userRef?.email || "No email"})
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Request date:</p>
                      <p className="font-medium">
                        {req.createdAt ? format(new Date(req.createdAt), "MMM d, yyyy") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Law related:</p>
                      <p className="font-medium">
                        {req.isLawRelated ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  {req.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Description:</p>
                      <p className="mt-1 text-sm text-gray-700">{req.description}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewedByYou;