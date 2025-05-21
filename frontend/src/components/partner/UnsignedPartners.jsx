import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaFileAlt, FaEye, FaCheckCircle } from "react-icons/fa";
import { fetchUnsignedPartners, signPartner, fetchCurrentAdmin } from "../../api/adminApi";

const SignConfirmationModal = ({ isOpen, onClose, partner, onConfirm, isSigning }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Partner Signing</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to mark {partner.companyName} as a signed partner?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isSigning}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSigning}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSigning ? "Signing..." : "Confirm Sign"}
          </button>
        </div>
      </div>
    </div>
  );
};

const UnsignedPartners = () => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: partners, isLoading, error } = useQuery({
    queryKey: ["unsignedPartners"],
    queryFn: fetchUnsignedPartners
  });

  const { data: adminData } = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: fetchCurrentAdmin
  });

  const isGeneralDirector = adminData?.role === "general-director";

  const handleSignPartner = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleConfirmSign = async () => {
    if (!selectedPartner) return;
    
    setIsSigning(true);
    try {
      await signPartner(selectedPartner._id);
      queryClient.invalidateQueries(["unsignedPartners"]);
      setIsModalOpen(false);
      setSelectedPartner(null);
    } catch (error) {
      console.error("Error signing partner:", error);
    } finally {
      setIsSigning(false);
    }
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
      <div className="w-full bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-[#3c8dbc] mb-6">Unsigned Partners</h2>

        {partners?.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No unsigned partners found.</div>
        ) : (
          <div className="space-y-4">
            {partners?.map((partner) => (
              <div key={partner._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{partner.companyName}</h3>
                    <p className="text-gray-600">{partner.companyEmail}</p>
                    <p className="text-sm text-gray-500">Framework Type: {partner.frameworkType}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/admin/partners/${partner._id}`)}
                      className="px-4 py-2 text-[#3c8dbc] hover:text-[#2c6a8f] underline text-sm"
                    >
                      View Details
                    </button>
                    {isGeneralDirector && (
                      <button
                        onClick={() => handleSignPartner(partner)}
                        className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors"
                      >
                        Sign Partner
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SignConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
        onConfirm={handleConfirmSign}
        isSigning={isSigning}
      />
    </div>
  );
};

export default UnsignedPartners; 