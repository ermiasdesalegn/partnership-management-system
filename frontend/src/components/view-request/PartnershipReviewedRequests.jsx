// // components/PartnershipReviewedRequests.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PartnershipReviewedRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     const fetchReviewedRequests = async () => {
//       try {
//         const res = await axios.get("/api/partnership-reviewed", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setRequests(res.data.data);
//       } catch (err) {
//         console.error("Failed to fetch requests:", err);
//       }
//     };
//     fetchReviewedRequests();
//   }, []);

//   return (
//     <div>
//       <h2>Requests Reviewed by Partnership Division</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Request ID</th>
//             <th>Current Stage</th>
//             <th>Final Status</th>
//             <th>Your Decision</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.map((request) => (
//             <tr key={request._id}>
//               <td>{request._id}</td>
//               <td>{request.currentStage}</td>
//               <td>{request.status}</td>
//               <td>
//                 {
//                   request.approvals.find(
//                     (a) => a.stage === "partnership-division"
//                   )?.decision
//                 }
//               </td>
//               <td>
//                 {request.status === "In Review" && (
//                   <button onClick={() => handleViewDetails(request._id)}>
//                     Track Progress
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PartnershipReviewedRequests;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaBuilding, FaUser, FaFileAlt, FaGavel, FaClock, FaDownload } from 'react-icons/fa';
import { fetchPartnershipReviewedRequests } from "../../api/adminApi";

const PartnershipReviewedRequests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("approved");

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ["partnershipReviewedRequests"],
    queryFn: fetchPartnershipReviewedRequests
  });

  const filteredRequests = requests?.filter(req => 
    activeTab === "approved" ? req.status === "approved" : req.status === "disapproved"
  );

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full flex justify-center mt-8">
        <div className="bg-white shadow-xl w-[95%]">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Partnership Reviewed Requests</h1>
            
            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("approved")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "approved"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab("disapproved")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "disapproved"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Disapproved
              </button>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests?.map((req) => (
                <div
                  key={req._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/admin/request/${req._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{req.companyName}</h2>
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-600">
                          <FaBuilding className="mr-2" />
                          {req.companyType}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <FaUser className="mr-2" />
                          Submitted by: {req.submittedBy.name}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <FaClock className="mr-2" />
                          Submitted: {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                        {req.isLawServiceRelated && (
                          <p className="flex items-center text-gray-600">
                            <FaGavel className="mr-2" />
                            Law Service Review Required
                          </p>
                        )}
                        {req.isLawResearchRelated && (
                          <p className="flex items-center text-gray-600">
                            <FaGavel className="mr-2" />
                            Law Research Review Required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Attachments */}
                  {req.attachments?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Attachments:</h3>
                      <div className="flex flex-wrap gap-2">
                        {req.attachments.map((attachment, index) => (
                          <a
                            key={index}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaFileAlt className="mr-2" />
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipReviewedRequests;