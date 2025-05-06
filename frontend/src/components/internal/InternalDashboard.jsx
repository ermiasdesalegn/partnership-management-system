import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import axios from 'axios';

const InternalDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0
    },
    recentRequests: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
      if (!token) {
        navigate('/internal/login');
        return;
      }

        const response = await axios.get('http://localhost:5000/api/v1/internal/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
      setDashboardData(response.data.data);
      setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
      setLoading(false);
      }
    };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h2" color="blue-gray">
          Dashboard
          </Typography>
          <Button 
          color="blue"
            onClick={() => navigate('/internal/request')}
          >
          Create New Request
          </Button>
      </div>
        
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
                    Total Requests
                  </Typography>
          <Typography variant="h3" color="blue">
            {dashboardData.stats.totalRequests}
                  </Typography>
        </Card>
        <Card className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
                    Pending Requests
                  </Typography>
          <Typography variant="h3" color="yellow">
            {dashboardData.stats.pendingRequests}
                  </Typography>
        </Card>
        <Card className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
                    Completed Requests
                  </Typography>
          <Typography variant="h3" color="green">
            {dashboardData.stats.completedRequests}
          </Typography>
        </Card>
      </div>

      {/* Recent Requests Section */}
      <div className="mb-8">
        <Typography variant="h4" color="blue-gray" className="mb-4">
          Recent Requests
        </Typography>
        <div className="grid gap-6">
          {dashboardData.recentRequests.map((request) => (
            <Card key={request._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {request.title}
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    Created: {new Date(request.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <Button 
                    variant="text" 
                    color="blue"
                    onClick={() => navigate(`/internal/request/${request._id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Notifications Section */}
      <div>
        <Typography variant="h4" color="blue-gray" className="mb-4">
          Recent Notifications
                  </Typography>
        <div className="grid gap-4">
          {dashboardData.notifications.map((notification, index) => (
            <Card key={index} className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                              {notification.title}
                            </Typography>
              <Typography color="gray" className="mb-2">
                              {notification.message}
                            </Typography>
              <Typography variant="small" color="gray">
                {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternalDashboard;