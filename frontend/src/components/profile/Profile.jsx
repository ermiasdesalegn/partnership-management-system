// components/profile/Profile.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentAdmin } from "../../api/adminApi";
import { FaUserCircle, FaEnvelope, FaUserShield, FaCalendarAlt, FaClock } from "react-icons/fa";

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
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#3c8dbc]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 p-6">
        <div className="flex justify-center items-center min-h-[calc(100vh-3rem)] w-full">
          <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-black/10">
            <p className="text-red-500 text-lg text-center">Error: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 p-6">
      <div className="flex justify-center items-center min-h-[calc(100vh-3rem)] w-full">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-black/10 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-black/5 flex items-center justify-center">
                  <FaUserCircle className="w-20 h-20 text-[#3c8dbc]" />
                </div>
                <div className="absolute bottom-0 right-0 bg-[#3c8dbc] p-2 rounded-full">
                  <FaUserShield className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-black mb-2">{admin.name}</h1>
                <p className="text-black/70 capitalize text-lg">{admin.role.replace("-", " ")}</p>
                <div className="mt-4">
                  <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                    admin.isActive 
                      ? "bg-[#3c8dbc]/10 text-[#3c8dbc]" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    {admin.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-black/10">
            <h2 className="text-2xl font-semibold text-black mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-black/5 rounded-xl">
                <FaEnvelope className="w-6 h-6 text-[#3c8dbc]" />
                <div>
                  <p className="text-sm text-black/70">Email</p>
                  <p className="font-medium text-black text-lg">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-black/5 rounded-xl">
                <FaUserShield className="w-6 h-6 text-[#3c8dbc]" />
                <div>
                  <p className="text-sm text-black/70">Role</p>
                  <p className="font-medium text-black text-lg capitalize">{admin.role.replace("-", " ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-black/5 rounded-xl">
                <FaCalendarAlt className="w-6 h-6 text-[#3c8dbc]" />
                <div>
                  <p className="text-sm text-black/70">Created At</p>
                  <p className="font-medium text-black text-lg">{new Date(admin.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-black/5 rounded-xl">
                <FaClock className="w-6 h-6 text-[#3c8dbc]" />
                <div>
                  <p className="text-sm text-black/70">Last Login</p>
                  <p className="font-medium text-black text-lg">{new Date(admin.lastLogin).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 text-right">
              <button className="px-6 py-2.5 text-base rounded-full bg-[#3c8dbc] text-white hover:bg-[#2c6a8f] transition-colors shadow-md hover:shadow-lg">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;