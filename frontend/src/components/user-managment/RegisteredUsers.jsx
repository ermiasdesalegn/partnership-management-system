import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisteredUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
    
      try {
        const response = await axios.get("http://localhost:5000/api/v1/user", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        // Separate admins from regular users
        const allUsers = response.data.data.users;
        const adminUsers = allUsers.filter(user => 
          ['general-director', 'partnership-division'].includes(user.role)
        );
        const otherUsers = allUsers.filter(user => 
          !['general-director', 'partnership-division'].includes(user.role)
        );
        
        setAdmins(adminUsers);
        setRegularUsers(otherUsers);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const getRoleBadge = (role) => {
    const roleClasses = {
      "general-director": "bg-purple-100 text-purple-800",
      "partnership-division": "bg-blue-100 text-blue-800",
      "law-department": "bg-indigo-100 text-indigo-800",
      "internal": "bg-green-100 text-green-800",
      "external": "bg-yellow-100 text-yellow-800",
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleClasses[role] || 'bg-gray-100'}`}>
        {role.replace(/-/g, ' ')}
      </span>
    );
  };

  const renderUserDetails = (user) => {
    return (
      <div className="text-sm text-gray-600 mt-1">
        {user.department && <p>Department: {user.department}</p>}
        {user.company && (
          <>
            <p>Company: {user.company.name}</p>
            <p>Type: {user.company.type}</p>
          </>
        )}
      </div>
    );
  };

  const renderUserTable = (users, title) => (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      {renderUserDetails(user)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  {user.company?.phone && (
                    <div className="text-sm text-gray-500">{user.company.phone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container  sm:px-6 lg:px-4 py-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
          <p className="mt-1 text-sm text-gray-600">View and manage all registered users</p>
        </div>
        
        {admins.length > 0 && renderUserTable(admins, "Administrators")}
        {regularUsers.length > 0 && renderUserTable(regularUsers, "Regular Users")}
        
        {admins.length === 0 && regularUsers.length === 0 && (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">There are currently no registered users in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredUsers;