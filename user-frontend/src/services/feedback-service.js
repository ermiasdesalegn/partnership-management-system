import httpService from "./http-service.js";

const create = async (data) => {
  const response = await httpService("/api/v1/feedback").create(data);
  return response.data;
};

export default { create }; 