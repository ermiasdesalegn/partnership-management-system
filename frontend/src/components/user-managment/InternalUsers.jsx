import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InternalUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternalUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/v1/admin/users/internal", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch internal users");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInternalUsers();
  }, [navigate]);

  // Filter users based on search term and department
  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (departmentFilter) {
      filtered = filtered.filter(user => 
        user.department?.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, departmentFilter, users]);

  // Get unique departments for filter dropdown
  const departments = [...new Set(users.map(user => user.department).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#3c8dbc]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
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
    <div className="container sm:px-6 lg:px-4 py-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#3c8dbc]">Internal Users</h2>
          <p className="mt-1 text-sm text-gray-600">List of internal users and their request counts</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3c8dbc]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Number of Requests</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-[#3c8dbc]/5 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.department || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-[#3c8dbc] font-medium">{user.requestCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-[#3c8dbc]/5 p-8 rounded-lg text-center mt-6">
            <svg
              className="mx-auto h-12 w-12 text-[#3c8dbc]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L7 14.25M7 14.25L4.25 17M7 14.25v6.75M17 6.75L19.75 9.5M19.75 9.5L17 12.25M19.75 9.5H13"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-[#3c8dbc]">No internal users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || departmentFilter 
                ? "No users match your search criteria" 
                : "There are no internal users registered yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalUsers; 