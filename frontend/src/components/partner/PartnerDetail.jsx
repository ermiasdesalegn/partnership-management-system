import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { 
  FaBuilding, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaFileAlt,
  FaDownload,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFile
} from 'react-icons/fa';
import { 
  fetchPartnerById, 
  signPartner, 
  uploadPartnerAttachment, 
  removePartnerAttachment,
  fetchCurrentAdmin 
} from "../../api/adminApi";
import PartnerActivities from "./PartnerActivities";

const PartnerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const { data: partner, isLoading, error } = useQuery({
    queryKey: ["partnerDetail", id],
    queryFn: () => fetchPartnerById(id)
  });

  const { data: adminData } = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: fetchCurrentAdmin
  });

  const isGeneralDirector = adminData?.role === "general-director";
  const isPartnershipDivision = adminData?.role === "partnership-division";
  const isDirector = adminData?.role === "director";
  const canViewActivities = isGeneralDirector || isPartnershipDivision || isDirector;
  const canManageActivities = isGeneralDirector || isPartnershipDivision;
  const canManageApprovalAttachments = isGeneralDirector || isPartnershipDivision || isDirector;

  const signMutation = useMutation({
    mutationFn: signPartner,
    onSuccess: () => {
      toast.success("Partner marked as signed successfully");
      queryClient.invalidateQueries(["partnerDetail", id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error marking partner as signed");
    }
  });

  const uploadMutation = useMutation({
    mutationFn: uploadPartnerAttachment,
    onSuccess: () => {
      toast.success("File uploaded successfully");
      queryClient.invalidateQueries(["partnerDetail", id]);
      setFile(null);
      setDescription("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error uploading file");
    }
  });

  const removeMutation = useMutation({
    mutationFn: removePartnerAttachment,
    onSuccess: () => {
      toast.success("Attachment removed successfully");
      queryClient.invalidateQueries(["partnerDetail", id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error removing attachment");
    }
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    uploadMutation.mutate({
      partnerId: id,
      file,
      description,
      type: activeTab
    });
  };

  const handleRemoveAttachment = (attachmentId) => {
    removeMutation.mutate({
      partnerId: id,
      attachmentId,
      type: activeTab
    });
  };

  const handleSignPartner = () => {
    signMutation.mutate(id);
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
    <div className="w-full min-h-screen px-4 py-6 bg-gray-100">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#3c8dbc] mb-1">{partner.companyName}</h1>
              <div className="flex items-center space-x-3 text-gray-600 text-sm">
                <span className="flex items-center">
                  <FaBuilding className="mr-1" />
                  {partner.companyType}
                </span>
                <span className="flex items-center">
                  <FaEnvelope className="mr-1" />
                  {partner.companyEmail}
                </span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                partner.status === "Active" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {partner.status === "Active" ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                {partner.status}
              </span>
              {!partner.isSigned && isGeneralDirector && (
                <button
                  onClick={handleSignPartner}
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FaCheckCircle className="mr-1" />
                  Mark as Signed
                </button>
              )}
              {partner.isSigned && (
                <div className="text-xs text-gray-600">
                  <p>Signed by: {partner.signedBy?.name}</p>
                  <p>Signed on: {new Date(partner.signedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-[#3c8dbc] text-[#3c8dbc]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Partner Details
              </button>
              <button
                onClick={() => setActiveTab("request")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "request"
                    ? "border-[#3c8dbc] text-[#3c8dbc]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                User Attachments
              </button>
              <button
                onClick={() => setActiveTab("approval")}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "approval"
                    ? "border-[#3c8dbc] text-[#3c8dbc]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Admin Attachments
              </button>
              {partner.isSigned && canViewActivities && (
                <button
                  onClick={() => setActiveTab("activities")}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "activities"
                      ? "border-[#3c8dbc] text-[#3c8dbc]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Activities
                </button>
              )}
            </nav>
          </div>

          {/* Content */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900">Company Information</h3>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <p className="flex items-center text-sm text-gray-600">
                    <FaBuilding className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Company Type:</span> {partner.companyType}
                  </p>
                  <p className="flex items-center text-sm text-gray-600">
                    <FaEnvelope className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Email:</span> {partner.companyEmail}
                  </p>
                  <p className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Address:</span> {partner.companyAddress}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900">Partnership Details</h3>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <p className="flex items-center text-sm text-gray-600">
                    <FaFileAlt className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Framework Type:</span> {partner.frameworkType}
                  </p>
                  <p className="flex items-center text-sm text-gray-600">
                    <FaClock className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Duration:</span> {partner.requestRef?.duration?.value} {partner.requestRef?.duration?.type}
                  </p>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "request" || activeTab === "approval") && (
            <div className="space-y-4">
              {/* Upload Form - Only show for request attachments or if user has permission for approval attachments */}
              {(activeTab === "request" || (activeTab === "approval" && canManageApprovalAttachments)) && (
                <form onSubmit={handleUpload} className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload File
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center px-3 py-4 bg-white text-blue-600 rounded-lg border-2 border-dashed border-blue-200 cursor-pointer hover:border-blue-400 transition-colors w-full">
                          <svg
                            className="w-6 h-6 mb-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-xs">{file ? file.name : "Choose file"}</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Add a description for the file..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={uploadMutation.isLoading}
                      className="w-full px-3 py-1.5 text-sm bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors disabled:opacity-50"
                    >
                      {uploadMutation.isLoading ? "Uploading..." : "Upload File"}
                    </button>
                  </div>
                </form>
              )}

              {/* Attachments List */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900">
                  {activeTab === "request" ? "User Attachments" : "Admin Attachments"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {partner[activeTab === "request" ? "requestAttachments" : "approvalAttachments"].map((attachment, index) => {
                    const fileName = attachment.originalName || attachment.path.split(/[/\\]/).pop();
                    const filePath = attachment.path.split(/[/\\]/).pop();
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
                        <div className="flex items-center space-x-3">
                          <FaFile className="text-blue-500 text-lg" />
                          <div>
                            <p className="text-sm font-medium">{fileName}</p>
                            {activeTab === "approval" && (
                              <div className="text-xs text-gray-500 space-y-1">
                                <p>Uploaded by: {attachment.uploadedBy?.name || 'Unknown'}</p>
                                <p>Upload type: {attachment.uploaderModel || 'Unknown'}</p>
                                <p>Date: {attachment.uploadedAt ? new Date(attachment.uploadedAt).toLocaleDateString() : 'Unknown'}</p>
                                {attachment.description && (
                                  <p>Description: {attachment.description}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <a
                            href={`http://localhost:5000/public/uploads/${attachment.path.split(/[/\\]/).pop()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-blue-500 hover:text-blue-700"
                          >
                            <FaDownload />
                          </a>
                          {/* Only show remove button for request attachments or if user has permission for approval attachments */}
                          {(activeTab === "request" || (activeTab === "approval" && canManageApprovalAttachments)) && (
                            <button
                              onClick={() => handleRemoveAttachment(attachment._id)}
                              className="p-1.5 text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "activities" && partner.isSigned && canViewActivities && (
            <PartnerActivities partnerId={partner._id} canManageActivities={canManageActivities} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDetail; 