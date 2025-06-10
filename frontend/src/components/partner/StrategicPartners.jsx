import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaFileAlt, FaEye } from "react-icons/fa";
import { fetchPartners } from "../../api/adminApi";

const StrategicPartners = () => {
  const navigate = useNavigate();
  const { data: partners, isLoading, error } = useQuery({
    queryKey: ["partners"],
    queryFn: fetchPartners
  });

  // Filter for strategic partners
  const strategicPartners = partners?.filter(partner => 
    partner.partnershipRequestType === "strategic"
  ) || [];

  if (isLoading) {
    return (
      <div className="w-full min-h-screen px-8 py-10 bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#3c8dbc] mx-auto" />
        </div>
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
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#3c8dbc]">Strategic Partnerships</h2>
                <p className="mt-1 text-sm text-gray-600">List of all strategic partnerships</p>
              </div>
            </div>
          </div>

          {strategicPartners.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No strategic partnerships found</h3>
              <p className="mt-1 text-sm text-gray-500">There are currently no strategic partnerships.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-[#3c8dbc] text-white">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Framework</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Signing Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Attachments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {strategicPartners.map((partner) => (
                    <tr key={partner._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#3c8dbc]/10 rounded-full flex items-center justify-center">
                            <FaBuilding className="text-[#3c8dbc]" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{partner.companyName}</div>
                            <div className="text-sm text-gray-500">{partner.companyEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{partner.companyType}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3c8dbc]/10 text-[#3c8dbc]">
                          <FaFileAlt className="mr-1" />
                          {partner.frameworkType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          partner.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {partner.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          partner.isSigned
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {partner.isSigned ? "Active" : "Not Signed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center">
                            <FaFileAlt className="mr-1" />
                            {partner.requestAttachments?.length || 0} Request
                          </span>
                          <span className="flex items-center">
                            <FaFileAlt className="mr-1" />
                            {partner.approvalAttachments?.length || 0} Approval
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/partners/${partner._id}`)}
                            className="text-[#3c8dbc] hover:text-[#2c6a8f] flex items-center"
                          >
                            <FaEye className="mr-1" />
                            View Details
                          </button>
                          {partner.isSigned && (
                            <button
                              onClick={() => navigate(`/admin/partners/${partner._id}`, { state: { activeTab: 'report' } })}
                              className="text-green-600 hover:text-green-700 flex items-center"
                            >
                              <FaFileAlt className="mr-1" />
                              Report
                            </button>
                          )}
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
    </div>
  );
};

export default StrategicPartners; 