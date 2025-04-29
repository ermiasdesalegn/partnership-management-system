import httpService from "./http-service";

const create = () => httpService("/api/notifications");

export default create();
