import { Route } from "react-router";
import CyberLayout from "../../layouts/CyberLayout";
import CyberProfile from "../manager/cyber/Profile";
import CyberRequests from "../manager/cyber/Requests";

const CyberRoute = [
  <Route key={"cyber"} path="/cyber/" element={<CyberLayout />}>
    <Route path="profile" element={<CyberProfile />} />
    <Route path="requests" element={<CyberRequests />} />
  </Route>,
];

export default CyberRoute;
