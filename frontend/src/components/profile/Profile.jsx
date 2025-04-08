// components/profile/Profile.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentAdmin } from "../../api/adminApi";

const Profile = () => {
  const {
    data: admin,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: fetchCurrentAdmin,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg text-center">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto bg-gradient-to-br from-white via-gray-100 to-gray-200 p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-3xl w-full space-y-8 border border-gray-200 transition hover:shadow-2xl duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome, {admin.name}</h1>
            <p className="text-gray-500 capitalize">{admin.role.replace("-", " ")}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className={`px-4 py-2 text-sm font-medium rounded-full ${admin.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {admin.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
          <div className="space-y-1">
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{admin.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Role</p>
            <p className="font-medium capitalize">{admin.role.replace("-", " ")}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Created At</p>
            <p className="font-medium">{new Date(admin.createdAt).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Last Login</p>
            <p className="font-medium">{new Date(admin.lastLogin).toLocaleString()}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 text-right">
          <button className="px-5 py-2 text-sm rounded-full bg-gray-800 text-white hover:bg-gray-700 transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;


















// import React, { useState, useEffect } from 'react';
// import { FaUserShield, FaEnvelope, FaIdBadge, FaCalendarAlt, FaEdit } from 'react-icons/fa';

// function Profile() {
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAdminProfile = async () => {
//       const token = localStorage.getItem('token');
  
//       if (!token) {
//         setError('Authentication required. Please login.');
//         setLoading(false);
//         return;
//       }
  
//       try {
//         const res = await fetch('http://localhost:5000/api/v1/admin/me', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
  
//         if (!res.ok) {
//           const errData = await res.json();
//           throw new Error(errData.message || 'Failed to fetch admin data');
//         }
  
//         const data = await res.json();
//         setAdmin(data.data.admin);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchAdminProfile();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
//           <div className="text-red-500 font-medium">{error}</div>
//           <button 
//             onClick={() => window.location.href = '/'}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!admin) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
//           No admin data found
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             {/* Profile Header */}
//             <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex-shrink-0 h-16 w-16 rounded-full bg-white flex items-center justify-center text-blue-600 text-2xl font-bold">
//                     {admin.name.charAt(0)}
//                   </div>
//                   <div>
//                     <h3 className="text-lg leading-6 font-medium text-white">{admin.name}</h3>
//                     <p className="mt-1 text-sm text-blue-100">
//                       {admin.role.split('-').map(word => 
//                         word.charAt(0).toUpperCase() + word.slice(1)
//                       ).join(' ')}
//                     </p>
//                   </div>
//                 </div>
//                 <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                   <FaEdit className="mr-2" />
//                   Edit Profile
//                 </button>
//               </div>
//             </div>

//             {/* Profile Details */}
//             <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
//               <dl className="sm:divide-y sm:divide-gray-200">
//                 {/* Email */}
//                 <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaEnvelope className="mr-2 text-blue-500" />
//                     Email address
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {admin.email}
//                   </dd>
//                 </div>

//                 {/* Role */}
//                 <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaUserShield className="mr-2 text-purple-500" />
//                     Admin Role
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {admin.role.split('-').map(word => 
//                       word.charAt(0).toUpperCase() + word.slice(1)
//                     ).join(' ')}
//                   </dd>
//                 </div>

//                 {/* Status */}
//                 <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500 flex items-center">
//                     <div className={`h-3 w-3 rounded-full mr-2 ${admin.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                     Status
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {admin.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </dd>
//                 </div>

//                 {/* Created At */}
//                 <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaCalendarAlt className="mr-2 text-green-500" />
//                     Member Since
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {new Date(admin.createdAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </dd>
//                 </div>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;