// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { format } from "date-fns"; // For better date formatting

// const AdminRequestsTable = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         handleAuthError("No token found! Please log in.");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:5000/api/v1/request", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRequests(response.data.data.requests);
//       } catch (err) {
//         handleApiError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [navigate]);

//   const handleStatusUpdate = async (requestId, newStatus) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       handleAuthError("No token found! Please log in.");
//       return;
//     }

//     try {
//       // Update request status
//       const updateResponse = await axios.patch(
//         `http://localhost:5000/api/v1/requests/${requestId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` },}
//       )

//       // Update local state
//       setRequests(requests.map(request => 
//         request._id === requestId ? updateResponse.data.data.request : request
//       ));

//       // Send notification to user
//       const request = requests.find(r => r._id === requestId);
//       await axios.post(`http://localhost:5000/api/notifications/${request.userId}`, {
//         message: `Your request status has been updated to ${newStatus}`,
//         details: `Company: ${request.companyName}`,
//         link: `/requests/${requestId}`
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//     } catch (err) {
//       handleApiError(err);
//     }
//   };

//   const handleAuthError = (message) => {
//     setError(message);
//     setTimeout(() => {
//       localStorage.removeItem("token");
//       navigate("/login");
//     }, 2000);
//   };

//   const handleApiError = (error) => {
//     if (error.response?.status === 401) {
//       handleAuthError("Session expired. Redirecting to login...");
//     } else {
//       setError(error.response?.data?.message || "An error occurred");
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Partnership Requests</h2>
      
//       {loading ? (
//         <p>Loading requests...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : requests.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2">#</th>
//                 <th className="border border-gray-300 px-4 py-2">Requester</th>
//                 <th className="border border-gray-300 px-4 py-2">Company</th>
//                 <th className="border border-gray-300 px-4 py-2">Type</th>
//                 <th className="border border-gray-300 px-4 py-2">Status</th>
//                 <th className="border border-gray-300 px-4 py-2">Cooperation Area</th>
//                 <th className="border border-gray-300 px-4 py-2">Partnership Type</th>
//                 <th className="border border-gray-300 px-4 py-2">Created</th>
//                 <th className="border border-gray-300 px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((request, index) => (
//                 <tr key={request._id} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {request.userId?.name || "Unknown User"}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">{request.companyName}</td>
//                   <td className="border border-gray-300 px-4 py-2">{request.companyType}</td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     <span className={`px-2 py-1 rounded ${
//                       request.status === "Approved" ? "bg-green-200" :
//                       request.status === "Rejected" ? "bg-red-200" : "bg-yellow-200"
//                     }`}>
//                       {request.status}
//                     </span>
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">{request.areaOfCooperation}</td>
//                   <td className="border border-gray-300 px-4 py-2">{request.partnershipType}</td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {format(new Date(request.createdAt), "MMM dd, yyyy HH:mm")}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2 space-x-2">
//                     {request.status === "Pending" && (
//                       <>
//                         <button
//                           onClick={() => handleStatusUpdate(request._id, "Approved")}
//                           className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                         >
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => handleStatusUpdate(request._id, "Rejected")}
//                           className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p>No partnership requests found.</p>
//       )}
//     </div>
//   );
// };

// export default AdminRequestsTable;