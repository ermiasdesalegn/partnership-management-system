import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
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
    <div className="w-full min-h-screen bg-gray-100 px-10 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Request Details</h1>

        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Company:</span> {req.companyDetails?.name}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded ${req.status === "Approved" ? 'bg-green-100 text-green-800' : 
                req.status === "Disapproved" ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {req.status}
              </span>
            </p>
            <p className="text-lg">
              <span className="font-semibold">Framework Type:</span> {req.frameworkType}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Requested By:</span> {req.userRef?.name}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Current Stage:</span> 
              <span className="ml-2 capitalize">{req.currentStage}</span>
            </p>
            <p className="text-lg">
              <span className="font-semibold">Law Related:</span> 
              <span className="ml-2">{req.lawRelated ? "Yes" : "No"}</span>
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Approval Timeline</h2>
          <div className="space-y-4">
            {req.approvals?.map((approval, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(approval.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <p className="font-semibold text-blue-600 capitalize">
                      {approval.decision} by {approval.approvedBy?.name || 'Admin'}
                    </p>
                    <span className="text-sm text-gray-600">{approval.stage}</span>
                  </div>
                </div>

                {approval.message && (
                  <p className="mt-2 text-gray-700 italic">"{approval.message}"</p>
                )}

                {approval.attachments?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Attachments:</h4>
                    <div className="flex flex-wrap gap-2">
                      {approval.attachments.map((file, fileIndex) => (
                        <a
                          key={fileIndex}
                          href={`http://localhost:5000/public/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 bg-white rounded-md shadow-sm text-sm text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                          download
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {file.split('/').pop()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end border-t pt-6">
          <button
            onClick={() => {
              setDecisionType("approve");
              setModalOpen(true);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading && decisionType === "approve" 
              ? "Processing..." 
              : "Approve Request"}
          </button>
          <button
            onClick={() => {
              setDecisionType("disapprove");
              setModalOpen(true);
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading && decisionType === "disapprove" 
              ? "Processing..." 
              : "Disapprove Request"}
          </button>
        </div>
      </div>

      {/* Decision Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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