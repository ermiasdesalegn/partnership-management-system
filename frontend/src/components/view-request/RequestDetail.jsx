import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { fetchRequest, submitReview, fetchCurrentAdmin } from "../../api/adminApi";

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState("approve");
  const [isLawRelated, setIsLawRelated] = useState(false);
  const [forDirector, setForDirector] = useState(false);
  const [message, setMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [feedbackAttachments, setFeedbackAttachments] = useState([]);
  const [frameworkType, setFrameworkType] = useState("MOU");
  const [customFramework, setCustomFramework] = useState("");
  const [showCustomFramework, setShowCustomFramework] = useState(false);

  const { data: req, isLoading, error } = useQuery({
    queryKey: ["requestDetail", id],
    queryFn: () => fetchRequest(id)
  });

  const { data: adminData } = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: fetchCurrentAdmin
  });

  const handleFrameworkTypeChange = (e) => {
    const value = e.target.value;
    setFrameworkType(value);
    setShowCustomFramework(value === "Other");
    if (value !== "Other") {
      setCustomFramework("");
    }
  };

  const handleAttachmentChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleFeedbackAttachmentChange = (e) => {
    setFeedbackAttachments(Array.from(e.target.files));
  };

  const mutation = useMutation({
    mutationFn: () =>
      submitReview({
        id,
        decision: decisionType,
        currentStage: req?.currentStage,
        isLawRelated,
        message,
        feedbackMessage,
        frameworkType: frameworkType === "Other" ? customFramework : frameworkType,
        attachments,
        feedbackAttachments,
        forDirector
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

  const renderDecisionModal = () => {
    if (!modalOpen) return null;

    const modalTitle = () => {
      switch (adminData?.role) {
        case "partnership-division":
          return "Partnership Division Decision";
        case "law-department":
          return "Law Department Decision";
        case "director":
          return "Director Decision";
        case "general-director":
          return "General Director Decision";
        default:
          return "Review Decision";
      }
    };

    const showFrameworkConfig = adminData?.role === "partnership-division" && 
                              req?.currentStage === "partnership-division" && 
                              decisionType === "approve";

    // Check if the admin has permission to review this request
    const canReview = () => {
      switch (adminData?.role) {
        case "partnership-division":
          return req?.currentStage === "partnership-division";
        case "law-department":
          return req?.currentStage === "law-department";
        case "director":
          // Check if the request is meant for director review and is in the director stage
          if (!req?.forDirector || req?.currentStage !== "director") {
            return false;
          }
          return true;
        case "general-director":
          return req?.currentStage === "general-director";
        default:
          return false;
      }
    };

    if (!canReview()) {
      const message = adminData?.role === "director" && !req?.forDirector 
        ? "This request does not require director approval"
        : "You don't have permission to review this request";
      toast.error(message);
      setModalOpen(false);
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{modalTitle()}</h2>
            
            {/* Request Status */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Request Status</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Current Stage:</span> {req?.currentStage?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
                {adminData?.role === "director" && (
                  <p className="text-gray-600">
                    <span className="font-medium">Requires Director Approval:</span> {req?.forDirector ? "Yes" : "No"}
                  </p>
                )}
              </div>
            </div>

            {/* Only show framework configuration for partnership division */}
            {showFrameworkConfig && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3">Request Framework Configuration</h4>
                
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

                {req?.type === 'internal' && (
                  <div className="mb-2 flex items-center">
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
                )}

                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    id="forDirector"
                    checked={forDirector}
                    onChange={(e) => setForDirector(e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="forDirector" className="ml-2 text-gray-700">
                    This request requires director approval
                  </label>
                </div>
              </div>
            )}

            {/* Admin Notes Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2">
                  ADMIN ONLY
                </span>
                Internal Notes
              </h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes for other administrators
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add notes visible only to administrators..."
                />
              </div>

              {/* Admin Attachments */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments for administrators
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleAttachmentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {attachments.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    {attachments.length} file(s) selected
                  </div>
                )}
              </div>
            </div>

            {/* User Feedback Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mr-2">
                  USER VISIBLE
                </span>
                Feedback for Requester
              </h4>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback message for the requester
                </label>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add feedback that will be visible to the requester..."
                />
              </div>

              {/* User Feedback Attachments */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments for the requester
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFeedbackAttachmentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {feedbackAttachments.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    {feedbackAttachments.length} file(s) selected
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl flex justify-end items-center gap-3 sticky bottom-0">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              disabled={mutation.isLoading}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center ${
                decisionType === "approve" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {decisionType === "approve" ? (
                    <FaCheckCircle className="mr-2" />
                  ) : (
                    <FaTimesCircle className="mr-2" />
                  )}
                  Confirm {decisionType.charAt(0).toUpperCase() + decisionType.slice(1)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
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
                              const fileName = typeof file === 'string' 
                                ? file.includes('/') || file.includes('\\') 
                                  ? file.split(/[/\\]/).pop() 
                                  : file
                                : 'file';
                              return (
                                <div key={fileIndex} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                                  {getFileIcon(fileName)}
                                  <span className="text-sm text-gray-600 truncate">
                                    {fileName}
                                  </span>
                                  <a
                                    href={`http://localhost:5000/api/v1/files/${fileName}`}
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
                    
                    {/* Admin Notes (Only visible to admins) */}
                    {approval.message && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            ADMIN NOTES
                          </span>
                        </div>
                        <p className="text-gray-700">{approval.message}</p>
                        
                        {/* Admin Attachments */}
                        {approval.attachments && approval.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-blue-100">
                            <p className="text-xs font-medium text-blue-800 mb-1">Admin Attachments:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {approval.attachments.map((attachment, i) => {
                                const fileName = typeof attachment === 'string' 
                                  ? attachment.includes('/') || attachment.includes('\\')
                                    ? attachment.split(/[/\\]/).pop() 
                                    : attachment
                                  : 'file';
                                return (
                                  <div key={i} className="flex items-center space-x-2 bg-white p-1 rounded text-xs">
                                    {getFileIcon(fileName)}
                                    <span className="text-gray-600 truncate">{fileName}</span>
                                    <a
                                      href={`http://localhost:5000/api/v1/files/${fileName}`}
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
                    )}
                    
                    {/* User Feedback (Visible to both admin and user) */}
                    {approval.feedbackMessage && (
                      <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-100">
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                            FEEDBACK FOR REQUESTER
                          </span>
                        </div>
                        <p className="text-gray-700">{approval.feedbackMessage}</p>
                        
                        {/* Feedback Attachments */}
                        {approval.feedbackAttachments && approval.feedbackAttachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-green-100">
                            <p className="text-xs font-medium text-green-800 mb-1">Feedback Attachments:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {approval.feedbackAttachments.map((attachment, i) => {
                                const fileName = typeof attachment === 'string' 
                                  ? attachment.includes('/') || attachment.includes('\\')
                                    ? attachment.split(/[/\\]/).pop() 
                                    : attachment
                                  : 'file';
                                return (
                                  <div key={i} className="flex items-center space-x-2 bg-white p-1 rounded text-xs">
                                    {getFileIcon(fileName)}
                                    <span className="text-gray-600 truncate">{fileName}</span>
                                    <a
                                      href={`http://localhost:5000/api/v1/files/${fileName}`}
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

      {renderDecisionModal()}
    </div>
  );
};

export default RequestDetail;