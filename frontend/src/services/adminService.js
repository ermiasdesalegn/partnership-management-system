// // src/services/adminService.js
// import axios from 'axios';

// const API_URL = '/api/v1/admins'; // Adjust based on your API base URL

// // Get current admin profile
// export const getAdminProfile = async () => {
//   const response = await axios.get(`${API_URL}/me`);
//   return response.data;
// };

// // Update admin profile
// export const updateAdminProfile = async (data) => {
//   const response = await axios.patch(`${API_URL}/me`, data);
//   return response.data;
// };

// // Update password
// export const updateAdminPassword = async (data) => {
//   const response = await axios.patch(`${API_URL}/me/password`, data);
//   return response.data;
// };

// // Upload profile photo
// export const uploadProfilePhoto = async (file) => {
//   const formData = new FormData();
//   formData.append('photo', file);
  
//   const response = await axios.patch(`${API_URL}/me/photo`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });
//   return response.data;
// };

// // Upload cover photo
// export const uploadCoverPhoto = async (file) => {
//   const formData = new FormData();
//   formData.append('coverPhoto', file);
  
//   const response = await axios.patch(`${API_URL}/me/cover-photo`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });
//   return response.data;
// };