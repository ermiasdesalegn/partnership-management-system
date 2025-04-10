
export const fetchAdminUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/v1/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    });
  
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  };
  
  export const fetchAdminRequests = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/v1/admin/requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  };
  
  // api/adminApi.js
export const fetchCurrentAdmin = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/v1/admin/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch admin');
  const data = await res.json();
  return data.data.admin; // Only return the admin object
};

import axios from "axios";

// Adjust depending on who is logged in
export const fetchRequestsForCurrentAdmin = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`http://localhost:5000/api/v1/admin/requestsRelated`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  const requests = res.data.data;

  if (!Array.isArray(requests)) {
    throw new Error("Expected array of requests");
  }

  console.log("Fetched Requests:", requests);
  return requests;
};

// ✅ Submit a decision for review
export const submitReviewDecision = async ({ role, requestId, decision }) => {
  let endpoint = "";

  switch (role) {
    case "partnership-division":
      endpoint = `http://localhost:5000/api/v1/admin/review/partnership`;
      break;
    case "law-department":
      endpoint = `http://localhost:5000/api/v1/admin/review/law`;
      break;
    case "general-director":
      endpoint = `http://localhost:5000/api/v1/admin/review/general-director`;
      break;
    default:
      throw new Error("Invalid role for review");
  }

  const res = await axios.post(
    endpoint,
    { requestId, decision },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    }
  );

  return res.data;
};