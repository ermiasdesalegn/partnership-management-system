import axios, { CanceledError } from "axios";

// const baseUrl = "https://5000-idx-pms-website-1738062202275.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/";
const baseUrl = "http://localhost:5000/";

// Create Axios instance
const apiClient = axios.create({
  baseURL: baseUrl,
});

// Interceptor to add token to headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
export { CanceledError, baseUrl };
