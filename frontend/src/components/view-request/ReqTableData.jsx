import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminRequests } from "../../api/adminApi";

const RequestTable = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminRequests"],
    queryFn: fetchAdminRequests,
  });

  const requests = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container sm:px-6 lg:px-4 py-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-800">Partnership Requests</h2>
          <p className="mt-1 text-sm text-gray-600">List of all pending, reviewed, and approved requests</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Requested By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{req.companyDetails?.name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{req.companyDetails?.email || "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs font-medium rounded-full ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : req.status === "in review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="font-medium text-gray-900">
                      {req.userRef?.name || "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {req.userRef?.email || "—"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <div className="bg-gray-50 p-6 rounded-lg text-center mt-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L7 14.25M7 14.25L4.25 17M7 14.25v6.75M17 6.75L19.75 9.5M19.75 9.5L17 12.25M19.75 9.5H13"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">There are currently no partnership requests.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestTable;
