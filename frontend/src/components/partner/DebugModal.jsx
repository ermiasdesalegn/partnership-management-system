// import React, { useState, useEffect } from 'react';
// import { FaTimes } from 'react-icons/fa';
// import { fetchOverallPartnershipStatistics, fetchSignedPartnersActivityStatistics } from '../../api/adminApi';

// const DebugModal = ({ isOpen, onClose }) => {
//   const [debugInfo, setDebugInfo] = useState({});

//   const testAPICall = async () => {
//     setDebugInfo({ testing: true });
    
//     try {
//       console.log('Testing API calls...');
      
//       // Check token
//       const token = localStorage.getItem('token');
//       console.log('Token exists:', !!token);
      
//       if (!token) {
//         setDebugInfo(prev => ({ ...prev, error: 'No authentication token found' }));
//         return;
//       }

//       // Test overall stats
//       try {
//         console.log('Calling fetchOverallPartnershipStatistics...');
//         const overallData = await fetchOverallPartnershipStatistics();
//         console.log('Overall stats success:', overallData);
//         setDebugInfo(prev => ({ ...prev, overallSuccess: true, overallData }));
//       } catch (overallError) {
//         console.error('Overall stats error:', overallError);
//         setDebugInfo(prev => ({ 
//           ...prev, 
//           overallError: {
//             message: overallError.message,
//             status: overallError.response?.status,
//             statusText: overallError.response?.statusText,
//             data: overallError.response?.data
//           }
//         }));
//       }

//       // Test activity stats
//       try {
//         console.log('Calling fetchSignedPartnersActivityStatistics...');
//         const activityData = await fetchSignedPartnersActivityStatistics();
//         console.log('Activity stats success:', activityData);
//         setDebugInfo(prev => ({ ...prev, activitySuccess: true, activityData }));
//       } catch (activityError) {
//         console.error('Activity stats error:', activityError);
//         setDebugInfo(prev => ({ 
//           ...prev, 
//           activityError: {
//             message: activityError.message,
//             status: activityError.response?.status,
//             statusText: activityError.response?.statusText,
//             data: activityError.response?.data
//           }
//         }));
//       }
//     } catch (error) {
//       console.error('General error:', error);
//       setDebugInfo(prev => ({ ...prev, generalError: error.message }));
//     } finally {
//       setDebugInfo(prev => ({ ...prev, testing: false }));
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       testAPICall();
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
//         <div className="flex justify-between items-center p-6 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-[#3c8dbc]">API Debug Information</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 p-2"
//           >
//             <FaTimes size={20} />
//           </button>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* Testing Status */}
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="font-bold text-blue-800 mb-2">Testing Status:</h3>
//             <div>Currently Testing: {debugInfo.testing ? '✅' : '❌'}</div>
//           </div>

//           {/* Authentication */}
//           <div className="bg-yellow-50 p-4 rounded-lg">
//             <h3 className="font-bold text-yellow-800 mb-2">Authentication:</h3>
//             <div>Token exists: {localStorage.getItem('token') ? '✅' : '❌'}</div>
//             <div>Token length: {localStorage.getItem('token')?.length || 0}</div>
//           </div>

//           {/* Overall Stats Results */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-bold text-gray-800 mb-2">Overall Statistics API:</h3>
//             <div>Success: {debugInfo.overallSuccess ? '✅' : '❌'}</div>
//             {debugInfo.overallError && (
//               <div className="text-red-600 mt-2">
//                 <div>Error: {debugInfo.overallError.message}</div>
//                 <div>Status: {debugInfo.overallError.status}</div>
//                 <div>Status Text: {debugInfo.overallError.statusText}</div>
//                 {debugInfo.overallError.data && (
//                   <pre className="text-xs mt-2 max-h-20 overflow-auto">
//                     {JSON.stringify(debugInfo.overallError.data, null, 2)}
//                   </pre>
//                 )}
//               </div>
//             )}
//             {debugInfo.overallData && (
//               <pre className="text-xs mt-2 max-h-40 overflow-auto bg-white p-2 rounded">
//                 {JSON.stringify(debugInfo.overallData, null, 2)}
//               </pre>
//             )}
//           </div>

//           {/* Activity Stats Results */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-bold text-gray-800 mb-2">Activity Statistics API:</h3>
//             <div>Success: {debugInfo.activitySuccess ? '✅' : '❌'}</div>
//             {debugInfo.activityError && (
//               <div className="text-red-600 mt-2">
//                 <div>Error: {debugInfo.activityError.message}</div>
//                 <div>Status: {debugInfo.activityError.status}</div>
//                 <div>Status Text: {debugInfo.activityError.statusText}</div>
//                 {debugInfo.activityError.data && (
//                   <pre className="text-xs mt-2 max-h-20 overflow-auto">
//                     {JSON.stringify(debugInfo.activityError.data, null, 2)}
//                   </pre>
//                 )}
//               </div>
//             )}
//             {debugInfo.activityData && (
//               <pre className="text-xs mt-2 max-h-40 overflow-auto bg-white p-2 rounded">
//                 {JSON.stringify(debugInfo.activityData, null, 2)}
//               </pre>
//             )}
//           </div>

//           {/* Manual Test Button */}
//           <div className="text-center">
//             <button
//               onClick={testAPICall}
//               disabled={debugInfo.testing}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               {debugInfo.testing ? 'Testing...' : 'Test API Calls Again'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DebugModal; 