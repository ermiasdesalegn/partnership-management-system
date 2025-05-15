import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaFileAlt, FaEye, FaClock, FaCheckCircle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const fetchUnsignedPartners = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/api/v1/partners/unsigned", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return res.data.data;
};

const signPartner = async (partnerId) => {
  const token = localStorage.getItem("token");
  const res = await axios.patch(
    `http://localhost:5000/api/v1/partners/${partnerId}/sign`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    }
  );
  return res.data.data;
};

const SignConfirmationModal = ({ isOpen, onClose, partner, onConfirm, isSigning }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaCheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirm Partner Signing
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to mark <span className="font-semibold text-gray-700">{partner.companyName}</span> as signed?
                  </p>
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Company Type</p>
                        <p className="font-medium text-gray-900">{partner.companyType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Framework</p>
                        <p className="font-medium text-gray-900">{partner.frameworkType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{partner.companyEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium text-gray-900">{partner.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSigning}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing...
                </>
              ) : (
                'Confirm Signing'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSigning}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UnsignedPartners = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: partners, isLoading, error } = useQuery({
    queryKey: ["unsignedPartners"],
    queryFn: fetchUnsignedPartners
  });

  const signMutation = useMutation({
    mutationFn: signPartner,
    onSuccess: () => {
      queryClient.invalidateQueries(["unsignedPartners"]);
      toast.success("Partner marked as signed successfully");
      setIsModalOpen(false);
      setSelectedPartner(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to sign partner");
    }
  });

  const handleSignPartner = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleConfirmSign = () => {
    if (selectedPartner) {
      signMutation.mutate(selectedPartner._id);
    }
  };

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
            <h2 className="text-3xl font-bold text-[#3c8dbc]">Unsigned Partnerships</h2>
            <p className="mt-1 text-sm text-gray-600">List of all unsigned partnerships awaiting signature</p>
          </div>

          {partners.length === 0 ? (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No unsigned partnerships found</h3>
              <p className="mt-1 text-sm text-gray-500">There are currently no partnerships awaiting signature.</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {partners.map((partner) => (
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
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => navigate(`/admin/partners/${partner._id}`)}
                            className="text-[#3c8dbc] hover:text-[#2c6a8f] flex items-center"
                          >
                            <FaEye className="mr-1" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleSignPartner(partner)}
                            className="text-green-600 hover:text-green-700 flex items-center"
                          >
                            <FaCheckCircle className="mr-1" />
                            Mark as Signed
                          </button>
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

      <SignConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
        onConfirm={handleConfirmSign}
        isSigning={signMutation.isPending}
      />
    </div>
  );
};

export default UnsignedPartners; 