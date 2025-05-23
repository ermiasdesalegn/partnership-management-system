import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminRequests } from "../../api/adminApi";
import {
  FaBuilding,
  FaUser,
  FaFilter,
  FaExternalLinkAlt,
  FaUserTie,
} from "react-icons/fa";

const RequestTable = () => {
  const [filters, setFilters] = useState({
    type: "",
    department: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminRequests", filters],
    queryFn: () => fetchAdminRequests({
      type: filters.type || undefined,
      department: filters.department || undefined
    }),
  });

  const requests = data?.data || [];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <div className="w-full min-h-screen px-8 py-10 bg-gray-100">
      <div className="w-full bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#3c8dbc]">Partnership Requests</h2>
          <p className="mt-1 text-sm text-gray-600">List of all pending, reviewed, and approved requests</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-[#3c8dbc]" />
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc]"
            >
              <option value="">All Types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <FaUserTie className="text-[#3c8dbc]" />
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc]"
            >
              <option value="">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              {/* Add more departments as needed */}
            </select>
          </div>
        </div>

        {requests.length === 0 ? (
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-[#3c8dbc] text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Requested By</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{req.companyDetails?.name || "—"}</span>
                        <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          req.type === 'internal' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {req.type === 'internal' ? 'Internal Request' : 'External Request'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{req.companyDetails?.email || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        req.type === 'internal' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {req.type === 'internal' ? (
                          <FaUser className="mr-1" />
                        ) : (
                          <FaExternalLinkAlt className="mr-1" />
                        )}
                        {req.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {req.userRef?.department || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                          req.status && req.status.toLowerCase() === "approved"
                            ? "bg-green-100 text-green-800"
                            : req.status && req.status.toLowerCase() === "In Review"
                            ? "bg-yellow-100 text-yellow-800"
                            : req.status && req.status.toLowerCase() === "disapproved"
                            ? "bg-red-100 text-red-800"
                            : "bg-[#3c8dbc]/10 text-[#3c8dbc]"
                        }`}
                      >
                        {req.status && req.status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
        )}
      </div>
    </div>
  );
};

export default RequestTable;
