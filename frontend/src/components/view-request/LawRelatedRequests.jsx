// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { ToastContainer, toast } from 'react-toastify';
// import { FaCheckCircle, FaTimesCircle, FaForward, FaFileAlt, FaDownload, FaBuilding, FaUser, FaClock, FaGavel } from 'react-icons/fa';
// import { fetchLawServiceRequests, fetchLawResearchRequests, forwardToGeneralDirector } from '../../api/adminApi';
// import { useNavigate } from 'react-router-dom';

// const LawRelatedRequests = ({ currentAdmin }) => {
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   // Fetch requests based on admin role
//   const { data: requests, isLoading, error } = useQuery({
//     queryKey: ['lawRequests', currentAdmin.role],
//     queryFn: async () => {
//       if (currentAdmin.role === 'law-service') {
//         return fetchLawServiceRequests();
//       } else if (currentAdmin.role === 'law-research') {
//         return fetchLawResearchRequests();
//       }
//       return [];
//     },
//     enabled: ['law-service', 'law-research'].includes(currentAdmin.role),
//   });

//   // Forward to General Director mutation
//   const forwardMutation = useMutation({
//     mutationFn: forwardToGeneralDirector,
//     onSuccess: () => {
//       toast.success('Request forwarded to General Director successfully');
//       queryClient.invalidateQueries(['lawRequests']);
//       setSelectedRequest(null);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to forward request');
//     },
//   });

//   const handleForward = async (requestId) => {
//     if (window.confirm('Are you sure you want to forward this request to the General Director?')) {
//       forwardMutation.mutate(requestId);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-red-500 text-center p-4">
//         Error loading requests: {error.message}
//         </div>
//     );
//   }

//   if (!requests || requests.length === 0) {
//     return (
//       <div className="text-gray-500 text-center p-4">
//         No {currentAdmin.role === 'law-service' ? 'law service' : 'law research'} requests found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <ToastContainer />
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Law Related Requests</h1>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-2xl font-semibold mb-6">
//             {currentAdmin.role === 'law-service' ? 'Law Service' : 'Law Research'} Requests
//           </h2>
          
//           <div className="space-y-4">
//             {requests.map((request) => (
//             <div
//               key={request._id}
//                 className="border rounded-lg p-4 hover:shadow-md transition-shadow"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                     <h3 className="font-medium text-lg">{request.title}</h3>
//                     <p className="text-gray-600 mt-1">{request.description}</p>
//                     <div className="mt-2 text-sm text-gray-500">
//                       <p>Status: <span className="capitalize">{request.status}</span></p>
//                       {request.partnershipRequestType && (
//                         <p className="mt-1">
//                           Partnership Type: 
//                           <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-[#3c8dbc]/10 text-[#3c8dbc] capitalize">
//                             {request.partnershipRequestType}
//                           </span>
//                         </p>
//                       )}
//                       <p>Created: {new Date(request.createdAt).toLocaleDateString()}</p>
//                     </div>
//                   </div>
                  
//                   {currentAdmin.role === request.currentStage && (
//                     <button
//                       onClick={() => handleForward(request._id)}
//                       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
//                       disabled={forwardMutation.isLoading}
//                     >
//                       {forwardMutation.isLoading ? 'Forwarding...' : 'Forward to General Director'}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LawRelatedRequests; 