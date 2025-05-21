import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

// Get dashboard data for internal users
export const fetchDashboardData = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/internal/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get user profile
export const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/internal/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${BASE_URL}/internal/profile`, profileData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Get all requests for the user
export const fetchUserRequests = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/internal/requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get request details
export const fetchRequestDetails = async (requestId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/internal/requests/${requestId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Submit new request
export const submitRequest = async (requestData) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  // Append all request data to formData
  Object.keys(requestData).forEach(key => {
    if (key === 'files') {
      requestData[key].forEach(file => {
        formData.append('files', file);
      });
    } else {
      formData.append(key, requestData[key]);
    }
  });

  const response = await axios.post(`${BASE_URL}/internal/requests`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Get user statistics
export const fetchUserStats = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/internal/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/internal/login`, credentials);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${BASE_URL}/internal/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}; 