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
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500" />
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