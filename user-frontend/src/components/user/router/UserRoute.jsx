import { Route } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import UserHomepage from "../../../pages/user/UserHomepage";
import RequestForm from "../RequestForm";
import Profile from "../Profile";
import RequestStatus from "../RequestStatus";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import Feedback from "../../feedback/Feedback";
import HowTo from "../landing/HowTo";
import FAQ from "../../support/FAQ"; // Import the FAQ component
import RequestDetails from "../RequestDetails";

const UserRoute = [
  // <Route key="user" element={<ProtectedRoute />}> {/* Protect all user routes */}
    <Route path="user" element={<UserLayout />}>
      <Route index element={<UserHomepage />} />
      <Route path="request" element={<RequestForm />} />
      <Route path="profile" element={<Profile />} />
      <Route path="request-status" element={<RequestStatus />} />
      <Route path="requests/:id" element={<RequestDetails />} />
      <Route path="howto" element={<HowTo />} />
      <Route path="faq" element={<FAQ />} /> {/* Added FAQ Route */}
      <Route path="feedback" element={<Feedback />} />
    </Route>
   
  
];

export default UserRoute;
