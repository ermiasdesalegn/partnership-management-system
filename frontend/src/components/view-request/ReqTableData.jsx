import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminRequests, fetchCurrentAdmin } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaUser,
  FaFilter,
  FaExternalLinkAlt,
  FaUserTie,
  FaEye,
} from "react-icons/fa";

const RequestTable = () => {
  const navigate = useNavigate();
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

  const { data: adminData } = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: fetchCurrentAdmin
  });

  const adminRole = adminData?.role;
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
      <div className="w-full px-4 py-6">
        <div className="max-w-6xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">
            {error.message || "Something went wrong."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 py-6 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#3c8dbc]">Partnership Requests</h2>
          <p className="mt-1 text-sm text-gray-600">List of all pending, reviewed, and approved requests</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-[#3c8dbc]" />
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] text-sm"
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] text-sm"
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
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Company Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Department</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Requested By</th>
                  {/* Only show Actions column if not law-service or law-research */}
                  {adminRole !== 'law-service' && adminRole !== 'law-research' && (
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <FaBuilding className="text-gray-400 mr-2 flex-shrink-0" />
                          <span className="font-medium truncate max-w-[150px]">{req.companyDetails?.name || "—"}</span>
                        </div>
                        <span className={`mt-2 px-2 py-1 rounded-full text-xs font-medium w-fit ${
                          req.type === 'internal' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {req.type === 'internal' ? 'Internal' : 'External'}
                        </span>
                        {/* Show email on mobile */}
                        <div className="text-xs text-gray-500 sm:hidden mt-1 truncate max-w-[150px]">
                          {req.companyDetails?.email || "—"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700 hidden sm:table-cell">
                      <div className="truncate max-w-[150px]">{req.companyDetails?.email || "—"}</div>
                    </td>
                    <td className="px-3 py-4">
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
                    <td className="px-3 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      <div className="truncate max-w-[100px]">{req.userRef?.department || "—"}</div>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${
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
                    <td className="px-3 py-4 text-sm text-gray-600 hidden md:table-cell">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate max-w-[120px]">
                            {req.userRef?.name || "—"}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[120px]">
                            {req.userRef?.email || "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Only show Actions button if not law-service or law-research */}
                    {adminRole !== 'law-service' && adminRole !== 'law-research' && (
                      <td className="px-3 py-4 text-sm text-gray-600">
                        <button
                          onClick={() => navigate(`/admin/request/${req._id}`)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-[#3c8dbc] hover:bg-[#2c6a8f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] transition-colors duration-200"
                        >
                          <FaEye className="mr-1" />
                          <span className="hidden sm:inline">View</span>
                          <span className="sm:hidden">Details</span>
                        </button>
                      </td>
                    )}
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
