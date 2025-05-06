import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaBuilding, 
  FaUser, 
  FaFileAlt, 
  FaGavel, 
  FaClock, 
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaFilePdf,
  FaFileWord,
  FaFileImage
} from 'react-icons/fa';

const fetchRequest = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`http://localhost:5000/api/v1/admin/requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return res.data.data;
};

const submitReview = async ({ id, decision, currentStage, isLawRelated, message, file, frameworkType }) => {
  const token = localStorage.getItem("token");
  const endpoint =
    currentStage === "partnership-division"
      ? "admin/review/partnership"
      : "admin/review/general-director";

  const formData = new FormData();
  formData.append("requestId", id);
  formData.append("decision", decision);
  formData.append("message", message || "");
  if (currentStage === "partnership-division") {
    formData.append("isLawRelated", isLawRelated);
    formData.append("frameworkType", frameworkType);
    if (file) {
      formData.append("attachment", file);
    }
  }

  const res = await axios.post(`http://localhost:5000/api/v1/${endpoint}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    },
    withCredentials: true
  });
  return res.data;
};

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState("approve");
  const [isLawRelated, setIsLawRelated] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [frameworkType, setFrameworkType] = useState("MOU");
  const [customFramework, setCustomFramework] = useState("");
  const [showCustomFramework, setShowCustomFramework] = useState(false);

  const { data: req, isLoading, error } = useQuery({
    queryKey: ["requestDetail", id],
    queryFn: () => fetchRequest(id)
  });

  const handleFrameworkTypeChange = (e) => {
    const value = e.target.value;
    setFrameworkType(value);
    setShowCustomFramework(value === "Other");
    if (value !== "Other") {
      setCustomFramework("");
    }
  };

  const mutation = useMutation({
    mutationFn: () =>
      submitReview({
        id,
        decision: decisionType,
        currentStage: req?.currentStage,
        isLawRelated,
        message,
        file,
        frameworkType: frameworkType === "Other" ? customFramework : frameworkType
      }),
    onSuccess: () => {
      toast.success("Action submitted successfully!");
      queryClient.invalidateQueries(["requestDetail", id]);
      setModalOpen(false);
      setTimeout(() => navigate(-1), 1500);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  });

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full flex justify-center mt-8">
          <div className="bg-white shadow-xl w-[95%] relative">
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full flex justify-center mt-8">
          <div className="bg-white shadow-xl w-[95%] p-6">
            <p className="text-red-500 text-lg">Error: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (frameworkType === "Other" && !customFramework.trim()) {
      toast.error("Please specify the framework type");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full flex justify-center mt-8">
        <div className="bg-white shadow-xl w-[95%] max-w-[1800px]">
          {/* Header Section */}
          <div className="bg-[#3c8dbc] px-6 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{req.companyDetails?.name}</h1>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span className="flex items-center">
                    <FaBuilding className="mr-2" />
                    {req.companyDetails?.type}
                  </span>
                  <span className="flex items-center">
                    <FaUser className="mr-2" />
                    {req.userRef?.name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  req.status === "Approved" 
                    ? "bg-green-100 text-green-800" 
                    : req.status === "Disapproved" 
                    ? "bg-red-100 text-red-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {req.status === "Approved" ? <FaCheckCircle className="mr-2" /> : 
                   req.status === "Disapproved" ? <FaTimesCircle className="mr-2" /> : 
                   <FaHourglassHalf className="mr-2" />}
                  {req.status}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6">
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Request Information</h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-600">
                      <FaFileAlt className="mr-2 text-blue-500" />
                      <span className="font-medium">Framework Type:</span> {req.frameworkType}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FaClock className="mr-2 text-blue-500" />
                      <span className="font-medium">Duration:</span> {req.duration}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FaGavel className="mr-2 text-blue-500" />
                      <span className="font-medium">Law Related:</span> {req.lawRelated ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Company Details</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {req.companyDetails?.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span> {req.companyDetails?.address}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {req.companyDetails?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            {req.attachments && req.attachments.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Attached Files</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {req.attachments.map((attachment, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getFileIcon(attachment.originalName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachment.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attachment.uploadedBy?.name || "Unknown"} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <a
                          href={`http://localhost:5000/api/v1/files/${attachment.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <FaDownload />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval History Section */}
            {req.approvals && req.approvals.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Approval History</h2>
                <div className="space-y-4">
                  {req.approvals.map((approval, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {approval.approvedBy?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {approval.approvedBy?.email} • {approval.approvedBy?.role} • {new Date(approval.date).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          approval.decision === "approve" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {approval.decision === "approve" ? "Approved" : "Disapproved"}
                        </span>
                      </div>
                      
                      {approval.message && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <p className="text-gray-700">{approval.message}</p>
                        </div>
                      )}

                      {approval.attachments && approval.attachments.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Files:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {approval.attachments.map((file, fileIndex) => {
                              const fileName = file.split('/').pop();
                              return (
                                <div key={fileIndex} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                                  {getFileIcon(fileName)}
                                  <span className="text-sm text-gray-600 truncate">
                                    {fileName}
                                  </span>
                                  <a
                                    href={`http://localhost:5000/api/v1/files/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto text-gray-400 hover:text-gray-600"
                                  >
                                    <FaDownload />
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Approval Timeline</h2>
              <div className="space-y-3">
                {req.approvals?.map((approval, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">
                          {new Date(approval.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                        <p className="font-semibold text-blue-600 capitalize">
                          {approval.decision} by {approval.approvedBy?.name}
                        </p>
                        <span className="text-sm text-gray-600">{approval.stage}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        approval.decision === 'approve' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {approval.decision}
                      </div>
                    </div>
                    {approval.message && (
                      <p className="mt-2 text-gray-700 italic">"{approval.message}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end border-t pt-4">
              <button
                onClick={() => {
                  setDecisionType("approve");
                  setModalOpen(true);
                }}
                className="px-6 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors disabled:opacity-50 flex items-center"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading && decisionType === "approve" 
                  ? "Processing..." 
                  : (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Approve Request
                    </>
                  )}
              </button>
              <button
                onClick={() => {
                  setDecisionType("disapprove");
                  setModalOpen(true);
                }}
                className="px-6 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors disabled:opacity-50 flex items-center"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading && decisionType === "disapprove" 
                  ? "Processing..." 
                  : (
                    <>
                      <FaTimesCircle className="mr-2" />
                      Disapprove Request
                    </>
                  )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              {req.currentStage === "partnership-division" 
                ? "Partnership Division Decision" 
                : "General Director Decision"}
            </h3>

            {req.currentStage === "partnership-division" && decisionType === "approve" && (
              <>
                {/* Framework Type Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Framework Type
                  </label>
                  <select
                    value={frameworkType}
                    onChange={handleFrameworkTypeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MOU">MOU (Memorandum of Understanding)</option>
                    <option value="Contract">Contract</option>
                    <option value="NDA">NDA (Non-Disclosure Agreement)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {showCustomFramework && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specify Framework Type
                    </label>
                    <input
                      type="text"
                      value={customFramework}
                      onChange={(e) => setCustomFramework(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter framework type"
                    />
                  </div>
                )}

                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="lawRelated"
                    checked={isLawRelated}
                    onChange={(e) => setIsLawRelated(e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="lawRelated" className="ml-2 text-gray-700">
                    This request involves legal matters
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach supporting document (optional)
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
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decision Notes
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Add any additional comments..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={mutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  decisionType === "approve" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={mutation.isLoading}
              >
                Confirm {decisionType.charAt(0).toUpperCase() + decisionType.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail;