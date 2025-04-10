import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRequestsForCurrentAdmin } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";

const ToBeReviewed = () => {
  const navigate = useNavigate();

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ["adminRelated"],
    queryFn: fetchRequestsForCurrentAdmin,
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  if (error) {
    const backendMessage = error.response?.data?.message;

    if (
      error.response?.status === 404 &&
      backendMessage?.includes("No requests found")
    ) {
      return (
        <div className="w-full px-8 py-10">
          <div className="w-full bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Requests to be Reviewed</h2>
            <div className="text-center text-gray-500 text-lg">
              {backendMessage}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full px-8 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">
            {backendMessage || error.message || "Something went wrong."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-8 py-10 bg-gray-100">
      <div className="w-full bg-white shadow-xl rounded-lg p-8 overflow-x-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Requests to be Reviewed</h2>

        {requests.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No requests found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Company</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Email</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Requested By</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="px-6 py-4">{req.companyDetails?.name || "—"}</td>
                  <td className="px-6 py-4">{req.companyDetails?.email || "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : req.status === "In Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "Disapproved"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{req.userRef?.name || "—"}</div>
                    <div className="text-xs text-gray-500">{req.userRef?.email || "—"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/admin/requests-in-progress/request/${req._id}`)}
                      className="text-blue-600 hover:text-blue-900 underline text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ToBeReviewed;
