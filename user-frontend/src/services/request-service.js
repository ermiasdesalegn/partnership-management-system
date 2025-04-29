import httpService from "./http-service";

const create = () => httpService("/api/requests");

export default create();
