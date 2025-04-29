import httpService from "./http-service";
import apiClient from "./api-client";

const authService = httpService("/api/auth");

// Attach login and logout methods to the userService instance
authService.login = (userData) => apiClient.post("/api/auth/login", userData);
authService.logout = () => apiClient.post("/api/auth/logout");

export default authService;
