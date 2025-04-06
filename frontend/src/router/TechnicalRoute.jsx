import { Route } from "react-router";
import TechnicalLayout from "../../layouts/TechnicalLayout";
import TechnicalProfile from "../manager/technical/Profile";
import { TechnicalRequests } from "../manager/technical/Requests"; // Changed to named import

const TechnicalRoute = [
  <Route key="technical" path="/technical/" element={<TechnicalLayout />}>
    <Route path="profile" element={<TechnicalProfile />} />
    <Route path="requests" element={<TechnicalRequests />} />
  </Route>,
];

export default TechnicalRoute;
