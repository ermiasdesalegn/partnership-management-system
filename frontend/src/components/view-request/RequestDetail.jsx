import React, { useState, useEffect } from "react";
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
  FaFileImage,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { fetchRequest, submitReview, fetchCurrentAdmin } from "../../api/adminApi";

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState("approve");
  const [isLawServiceRelated, setIsLawServiceRelated] = useState(false);
  const [isLawResearchRelated, setIsLawResearchRelated] = useState(false);
  const [forDirector, setForDirector] = useState(false);
  const [message, setMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [feedbackAttachments, setFeedbackAttachments] = useState([]);
  const [frameworkType, setFrameworkType] = useState("MOU");
  const [customFramework, setCustomFramework] = useState("");
  const [showCustomFramework, setShowCustomFramework] = useState(false);
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState("years");
  const [partnershipRequestType, setPartnershipRequestType] = useState("strategic");

  const { data: req, isLoading, error } = useQuery({
    queryKey: ["requestDetail", id],
    queryFn: () => fetchRequest(id)
  });

  const { data: adminData } = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: fetchCurrentAdmin
  });

  useEffect(() => {
    if (partnershipRequestType === "project" || partnershipRequestType === "tactical") {
      setIsLawResearchRelated(false);
    }
  }, [partnershipRequestType]);

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
        isLawServiceRelated,
        isLawResearchRelated,
        message,
        feedbackMessage,
        frameworkType: frameworkType === "Other" ? customFramework : frameworkType,
        attachments,
        feedbackAttachments,
        forDirector,
        duration: {
          value: duration,
          type: durationType
        },
        partnershipRequestType
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
      <div className="w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3c8dbc] mb-3" />
          <p className="text-gray-600 text-base">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-xl w-full max-w-7xl mx-auto p-4">
          <p className="text-red-500 text-base text-center">Error: {error.message}</p>
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
        case "law-service":
          return "Law Service Review";
        case "law-research":
          return "Law Research Review";
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

    const showUserFeedback = adminData?.role === "partnership-division";

    // Check if the admin has permission to review this request
    const canReview = () => {
      const { role } = adminData;
      const { currentStage } = req;

      switch (role) {
        case "partnership-division":
          return currentStage === "partnership-division";
        case "law-service":
          return currentStage === "law-service" && req.isLawServiceRelated;
        case "law-research":
          return currentStage === "law-research" && req.isLawResearchRelated;
        case "director":
          return currentStage === "director" && req.forDirector;
        case "general-director":
          return currentStage === "general-director";
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

            {/* Decision Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDecisionType("approve")}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    decisionType === "approve"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaCheckCircle className="mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => setDecisionType("disapprove")}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    decisionType === "disapprove"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaTimesCircle className="mr-2" />
                  Disapprove
                </button>
              </div>
            </div>

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

            {/* User Feedback Section - Only visible to partnership-division */}
            {showUserFeedback && (
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
            )}

            {/* Framework Configuration (only for partnership division) */}
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
                    <option value="MOA">MOA (Memorandum of Agreement)</option>
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

                {/* Partnership Duration */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partnership Duration
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        min="1"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter duration"
                        required
                      />
                    </div>
                    <div className="w-32">
                      <select
                        value={durationType}
                        onChange={(e) => setDurationType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    This duration will be used to set deadlines for all partnership activities
                  </p>
                </div>

                {/* Partnership Request Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partnership Request Type *
                    </label>
                  <select
                    value={partnershipRequestType}
                    onChange={(e) => setPartnershipRequestType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="strategic">Strategic</option>
                    <option value="operational">Operational</option>
                    <option value="project">Project</option>
                    <option value="tactical">Tactical</option>
                  </select>
                  </div>

                {/* Additional Options */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="lawServiceRelated"
                        checked={isLawServiceRelated}
                        onChange={(e) => setIsLawServiceRelated(e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="lawServiceRelated" className="ml-2 text-gray-700">
                        This request involves law service
                      </label>
                    </div>

                    {(partnershipRequestType === "strategic" || partnershipRequestType === "operational") && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="lawResearchRelated"
                          checked={isLawResearchRelated}
                          onChange={(e) => setIsLawResearchRelated(e.target.checked)}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="lawResearchRelated" className="ml-2 text-gray-700">
                          This request involves law research
                        </label>
                      </div>
                    )}

                  <div className="flex items-center">
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
              </div>
            )}
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
    <div className="bg-gray-50 py-6 w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full space-y-6 px-0">
          {/* Header Section */}
        <div className="bg-[#3c8dbc] px-6 py-6 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
              <h1 className="text-2xl font-bold text-white mb-1">{req.companyDetails?.name}</h1>
              <div className="flex items-center space-x-6 text-blue-100 text-base">
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
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold ${
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
        <div className="px-6 py-6 space-y-6">
            {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Request Information</h3>
                <div className="space-y-3 text-base">
                    <p className="flex items-center text-gray-600 text-lg">
                      <FaFileAlt className="mr-2 text-[#3c8dbc]" />
                      <span className="font-medium">Framework Type:</span> {req.frameworkType}
                    </p>
                    {req.partnershipRequestType && (
                      <p className="flex items-center text-gray-600 text-lg">
                        <FaFileAlt className="mr-2 text-[#3c8dbc]" />
                        <span className="font-medium">Partnership Type:</span>
                        <span className="ml-2 px-2 py-1 rounded-full text-sm font-medium bg-[#3c8dbc]/10 text-[#3c8dbc] capitalize">
                          {req.partnershipRequestType}
                        </span>
                      </p>
                    )}
                    <p className="flex items-center text-gray-600 text-lg">
                      <FaClock className="mr-2 text-[#3c8dbc]" />
                      <span className="font-medium">Duration:</span> {req.duration?.value} {req.duration?.type}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FaGavel className="mr-2 text-blue-500" />
                      <span className="font-medium">Law Service Related:</span> {req.isLawServiceRelated ? "Yes" : "No"}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FaGavel className="mr-2 text-blue-500" />
                      <span className="font-medium">Law Research Related:</span> {req.isLawResearchRelated ? "Yes" : "No"}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FaUser className="mr-2 text-blue-500" />
                      <span className="font-medium">Request Type:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        req.type === 'internal' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {req.type === 'internal' ? 'Internal Request' : 'External Request'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Company Details</h3>
                <div className="space-y-3 text-base">
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Attached Files</h2>
              {req.attachments && req.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {req.attachments.map((attachment, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-xl">
                          {getFileIcon(attachment.originalName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-900 truncate">
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
                          className="p-2 text-gray-400 hover:text-gray-600 text-lg"
                        >
                          <FaDownload />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FaFileAlt className="text-3xl text-gray-400" />
                    <p className="text-base text-gray-600">No attachments available</p>
                    <p className="text-xs text-gray-500">This request does not have any attached files.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Approval Timeline Section */}
          {req.approvals && req.approvals.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Approval History</h2>
              <div className="space-y-4">
                {req.approvals?.map((approval, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">
                          {new Date(approval.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                        <p className="font-semibold text-blue-600 capitalize text-base">
                          {approval.decision} by {approval.approvedBy?.name}
                        </p>
                        <span className="text-sm text-gray-600">{approval.stage}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-base font-medium ${
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
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            ADMIN NOTES
                          </span>
                        </div>
                        <p className="text-base text-gray-700">{approval.message}</p>
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
                                  <div key={i} className="flex items-center space-x-2 bg-white p-1 rounded text-sm">
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
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                            FEEDBACK FOR REQUESTER
                          </span>
                        </div>
                        <p className="text-base text-gray-700">{approval.feedbackMessage}</p>
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
                                  <div key={i} className="flex items-center space-x-2 bg-white p-1 rounded text-sm">
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
          )}

            {/* Action Buttons */}
          <div className="flex gap-4 justify-end border-t pt-6 mt-6">
              <button
                onClick={() => {
                  setDecisionType("approve");
                  setModalOpen(true);
                }}
              className="px-6 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors disabled:opacity-50 flex items-center text-base"
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
              className="px-6 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] transition-colors disabled:opacity-50 flex items-center text-base"
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

      {renderDecisionModal()}
    </div>
  );
};

export default RequestDetail;