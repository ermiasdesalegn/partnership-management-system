import { Route } from "react-router";
import Layout from "../../layouts/LegalLayout";
import Profile from "../manager/legal/Profile";
import Requests from "../manager/legal/Requests";

const LegalRoute = [
  <Route key={'egal'} path="/legal/" element={<Layout />}>
    <Route path="profile" element={<Profile />} />
    <Route path="requests" element={<Requests />} />
  </Route>,
];

export default LegalRoute;
