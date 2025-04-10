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