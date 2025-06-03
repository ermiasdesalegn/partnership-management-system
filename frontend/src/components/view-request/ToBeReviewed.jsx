import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRequestsForCurrentAdmin, fetchCurrentAdmin } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaUser, FaFileAlt, FaGavel, FaClock, FaDownload } from 'react-icons/fa';

const ToBeReviewed = () => {
  const navigate = useNavigate();

  // First fetch the current admin to get their role
  const { data: adminData } = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: fetchCurrentAdmin
  });

  // Then fetch requests based on the admin's role
  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ["adminRelated", adminData?.role],
    queryFn: () => fetchRequestsForCurrentAdmin(),
    enabled: !!adminData?.role, // Only fetch when we have the admin role
  });

  // Filter requests based on admin role and current stage
  const filteredRequests = React.useMemo(() => {
    if (!requests || !adminData?.role) return [];
    
    return requests.filter(req => {
      const { role } = adminData;
      const { currentStage, forDirector } = req;

      // For director role
      if (role === 'director') {
        return currentStage === 'director' && forDirector;
      }

      // For general director role
      if (role === 'general-director') {
        return currentStage === 'general-director';
      }

      // For other roles, match the current stage with the role
      return currentStage === role;
    });
  }, [requests, adminData?.role]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#3c8dbc]" />
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
            <h2 className="text-3xl font-bold text-[#3c8dbc] mb-6">Requests to be Reviewed</h2>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#3c8dbc]">Requests to be Reviewed</h2>
          <span className="text-sm text-gray-600">
            Current Role: {adminData?.role?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No requests found for your current role.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3c8dbc] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Company</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Email</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Type</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Partnership Type</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Requested By</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredRequests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaBuilding className="text-gray-400 mr-2" />
                      {req.companyDetails?.name || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4">{req.companyDetails?.email || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      req.type === 'internal' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {req.type === 'internal' ? 'Internal' : 'External'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {req.partnershipRequestType ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3c8dbc]/10 text-[#3c8dbc] capitalize">
                        {req.partnershipRequestType}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : req.status === "In Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "Disapproved"
                          ? "bg-red-100 text-red-800 font-bold"
                          : "bg-[#3c8dbc]/10 text-[#3c8dbc]"
                      }`}
                    >
                      {req.status === "disapproved" ? (
                        <span className="text-red-600">{req.status}</span>
                      ) : (
                        req.status
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <div>
                    <div className="font-medium">{req.userRef?.name || "—"}</div>
                    <div className="text-xs text-gray-500">{req.userRef?.email || "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/admin/requests-in-progress/request/${req._id}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#3c8dbc] hover:bg-[#2c6a8f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] transition-colors duration-200"
                    >
                      <FaFileAlt className="mr-2" />
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
