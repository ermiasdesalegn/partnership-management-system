// api/adminApi.js
// import Admin from "../../../backend/models/Admin";
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
