import apiClient from "./api-client";

export const fetchAllFeedback = async () => {
  const response = await apiClient.get("/api/v1/admin/feedback", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true
  });
  return response.data;
};

export const deleteFeedback = async (id) => {
  const response = await apiClient.delete(`/api/v1/admin/feedback/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true
  });
  return response.data;
}; 