import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

const fetchPartner = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`http://localhost:5000/api/v1/partners/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return res.data.data;
};

const PartnerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: partner, isLoading, error } = useQuery({
    queryKey: ["partnerDetail", id],
    queryFn: () => fetchPartner(id)
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

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    try {
      const token = localStorage.getItem("token");
      const endpoint = activeTab === "request" 
        ? `http://localhost:5000/api/v1/partners/${id}/request-attachments`
        : `http://localhost:5000/api/v1/partners/${id}/approval-attachments`;

      await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      toast.success("File uploaded successfully");
      queryClient.invalidateQueries(["partnerDetail", id]);
      setFile(null);
      setDescription("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAttachment = async (attachmentId) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = activeTab === "request"
        ? `http://localhost:5000/api/v1/partners/${id}/request-attachments/${attachmentId}`
        : `http://localhost:5000/api/v1/partners/${id}/approval-attachments/${attachmentId}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      toast.success("Attachment removed successfully");
      queryClient.invalidateQueries(["partnerDetail", id]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error removing attachment");
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
        {/* Header Section */}
        <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#3c8dbc] mb-2">{partner.companyName}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <FaBuilding className="mr-2" />
                  {partner.companyType}
                </span>
                <span className="flex items-center">
                  <FaEnvelope className="mr-2" />
                  {partner.companyEmail}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                partner.status === "Active" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {partner.status === "Active" ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                {partner.status}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-[#3c8dbc] text-[#3c8dbc]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Partner Details
              </button>
              <button
                onClick={() => setActiveTab("request")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "request"
                    ? "border-[#3c8dbc] text-[#3c8dbc]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Request Attachments
              </button>
              <button
                onClick={() => setActiveTab("approval")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "approval"
                    ? "border-[#3c8dbc] text-[#3c8dbc]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Approval Attachments
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p className="flex items-center text-gray-600">
                    <FaBuilding className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Company Type:</span> {partner.companyType}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Email:</span> {partner.companyEmail}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Address:</span> {partner.companyAddress}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Partnership Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p className="flex items-center text-gray-600">
                    <FaFileAlt className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Framework Type:</span> {partner.frameworkType}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-[#3c8dbc]" />
                    <span className="font-medium">Duration:</span> {partner.duration}
                  </p>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "request" || activeTab === "approval") && (
            <div className="space-y-6">
              {/* Upload Form */}
              <form onSubmit={handleUpload} className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg border-2 border-dashed border-blue-200 cursor-pointer hover:border-blue-400 transition-colors w-full">
                        <svg
                          className="w-8 h-8 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm">{file ? file.name : "Choose file"}</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Add a description for the file..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors disabled:opacity-50"
                  >
                    {loading ? "Uploading..." : "Upload File"}
                  </button>
                </div>
              </form>

              {/* Attachments List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab === "request" ? "Request Attachments" : "Approval Attachments"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partner[activeTab === "request" ? "requestAttachments" : "approvalAttachments"].map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                      <div className="flex items-center space-x-4">
                        <FaFile className="text-blue-500 text-xl" />
                        <div>
                          <p className="font-medium">{attachment.originalName}</p>
                          <p className="text-sm text-gray-500">{attachment.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={`http://localhost:5000/api/v1/files/${attachment.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-500 hover:text-blue-700"
                        >
                          <FaDownload />
                        </a>
                        <button
                          onClick={() => handleRemoveAttachment(attachment._id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDetail; 