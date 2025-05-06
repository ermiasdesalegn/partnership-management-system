import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: ''
  });
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/internal/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/v1/internal/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userData = response.data.data.user;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        department: userData.department || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/internal/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load request statistics');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        'http://localhost:5000/api/v1/internal/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedUser = response.data.data.user;
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name || '',
        department: updatedUser.department || ''
      });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3c8dbc]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#3c8dbc]/5 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3c8dbc] to-[#2c6a8f] opacity-90"></div>
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                  <UserCircleIcon className="w-20 h-20 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg">
                  <ShieldCheckIcon className="w-6 h-6 text-[#3c8dbc]" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{user?.name}</h1>
                <p className="text-white/80 text-lg mb-4">{user?.department}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                    Internal User
                  </span>
                  <span className="px-4 py-1 bg-green-500/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#3c8dbc]/10 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-[#3c8dbc]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#3c8dbc] rounded-full" style={{ width: '100%' }}></div>
            </div>
          </Card>
          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(stats.pendingRequests / stats.totalRequests) * 100}%` }}></div>
            </div>
          </Card>
          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedRequests}</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(stats.approvedRequests / stats.totalRequests) * 100}%` }}></div>
            </div>
          </Card>
          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <XMarkIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejectedRequests}</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${(stats.rejectedRequests / stats.totalRequests) * 100}%` }}></div>
            </div>
          </Card>
        </div>

        {/* Profile Information */}
        <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#3c8dbc]/10 rounded-lg">
                <UserCircleIcon className="w-6 h-6 text-[#3c8dbc]" />
              </div>
              <Typography variant="h4" color="blue-gray" className="font-bold">
                Personal Information
              </Typography>
            </div>
            <Button
              color={isEditing ? "red" : "blue"}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 rounded-full px-4 py-2"
              variant={isEditing ? "outlined" : "gradient"}
            >
              {isEditing ? (
                <>
                  <XMarkIcon className="w-5 h-5" />
                  Cancel
                </>
              ) : (
                <>
                  <PencilIcon className="w-5 h-5" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UserCircleIcon className="w-4 h-4 text-[#3c8dbc]" />
                    Full Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="!border !border-gray-300 focus:!border-[#3c8dbc] !rounded-lg"
                    labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-[#3c8dbc]" />
                    Department
                  </label>
                  <Input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="!border !border-gray-300 focus:!border-[#3c8dbc] !rounded-lg"
                    labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3c8dbc] to-[#2c6a8f] hover:from-[#2c6a8f] hover:to-[#3c8dbc] px-6 py-3"
                >
                  <CheckIcon className="w-5 h-5" />
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 