import httpService from "./http-service.js";
import apiClient from "./api-client.js";

const userService = httpService("/api/users");

userService.profile = () =>
  apiClient.get("/api/users/profile", {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });

export default userService;
