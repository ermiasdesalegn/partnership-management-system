import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fetchRequestById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`http://localhost:5000/api/v1/admin/requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data.data;
};

const submitDecision = async ({ id, decision, currentStage, isLawRelated }) => {
  const token = localStorage.getItem("token");
  // Determine the endpoint based on current stage
  const endpoint = currentStage === "partnership-division"
    ? "admin/review/partnership"
    : "admin/review/general-director";

  const payload = currentStage === "partnership-division"
    ? { requestId: id, decision, isLawRelated }
    : { requestId: id, decision };

  const res = await axios.post(
    `http://localhost:5000/api/v1/${endpoint}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
  return res.data;
};

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState("approve"); // 'approve' or 'disapprove'
  const [isLawRelated, setIsLawRelated] = useState(false);

  const { data: req, isLoading, error } = useQuery({
    queryKey: ["singleRequest", id],
    queryFn: () => fetchRequestById(id),
  });

  const decisionMutation = useMutation({
    mutationFn: ({ decision }) => 
      submitDecision({
        id,
        decision,
        currentStage: req?.currentStage,
        isLawRelated: req?.currentStage === "partnership-division" ? isLawRelated : undefined
      }),
    onSuccess: () => {
      setIsModalOpen(false);
      toast.success(
        decisionType === "approve" 
          ? "Request approved successfully!" 
          : "Request disapproved successfully!"
      );
      queryClient.invalidateQueries(["singleRequest", id]);
      setTimeout(() => navigate(-1), 1500);
    },
    onError: (error) => {
      toast.error(
        `Action failed: ${error.response?.data?.message || error.message}`
      );
    },
  });

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-600 p-8">Error: {error.message}</div>;

  const handleDecision = () => {
    decisionMutation.mutate({ decision: decisionType });
  };

  const getModalTitle = () => {
    if (req.currentStage === "partnership-division") {
      return "Partnership Division Decision";
    }
    return "General Director Decision";
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 px-10 py-8">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Request Detail</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p><span className="font-semibold">Company Name:</span> {req.companyDetails?.name}</p>
            <p><span className="font-semibold">Email:</span> {req.companyDetails?.email}</p>
            <p><span className="font-semibold">Status:</span> {req.status}</p>
            <p><span className="font-semibold">Current Stage:</span> {req.currentStage}</p>
          </div>

          <div>
            <p><span className="font-semibold">Requested By:</span> {req.userRef?.name}</p>
            <p><span className="font-semibold">User Email:</span> {req.userRef?.email}</p>
            {req.currentStage === "partnership-division" && (
              <p><span className="font-semibold">Law Related:</span> {req.isLawRelated ? "Yes" : "No"}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{req.description || "No description provided."}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Activity Timeline</h2>
          <ul className="space-y-2">
            {req.activityTimeline?.map((activity, index) => (
              <li key={index} className="bg-gray-200 p-4 rounded-md">
                <p className="text-sm text-gray-500">{activity.date}</p>
                <p>{activity.action}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => {
              setDecisionType("approve");
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            disabled={decisionMutation.isLoading}
          >
            {decisionMutation.isLoading && decisionType === "approve" 
              ? "Processing..." 
              : "Approve Request"}
          </button>
          <button
            onClick={() => {
              setDecisionType("disapprove");
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            disabled={decisionMutation.isLoading}
          >
            {decisionMutation.isLoading && decisionType === "disapprove" 
              ? "Processing..." 
              : "Disapprove Request"}
          </button>
        </div>
      </div>

      {/* Decision Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">
              {getModalTitle()} - {decisionType === "approve" ? "Approve" : "Disapprove"}
            </h2>
            
            {req.currentStage === "partnership-division" && decisionType === "approve" && (
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isLawRelated}
                    onChange={(e) => setIsLawRelated(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>Is this request law-related?</span>
                </label>
              </div>
            )}

            <p className="mb-4">Are you sure you want to {decisionType} this request?</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                disabled={decisionMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDecision}
                className={`px-4 py-2 text-white rounded-lg hover:opacity-90 ${
                  decisionType === "approve" ? "bg-green-600" : "bg-red-600"
                }`}
                disabled={decisionMutation.isLoading}
              >
                Confirm {decisionType === "approve" ? "Approval" : "Disapproval"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail;