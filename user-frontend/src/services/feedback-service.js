import httpService from "./http-service.js";

const create = () => httpService("/api/v1/feedback");

export default create(); 