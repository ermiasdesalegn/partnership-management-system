import { Route } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import UserHomepage from "../../../pages/user/UserHomepage";
import Notifications from "../Notifications";
import RequestForm from "../RequestForm";
import Profile from "../Profile";
import RequestStatus from "../RequestStatus";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import Support from "../landing/Support";
import HowTo from "../landing/HowTo";
import FAQ from "../../support/FAQ"; // Import the FAQ component
import RequestDetails from "../RequestDetails";

const UserRoute = [
  // <Route key="user" element={<ProtectedRoute />}> {/* Protect all user routes */}
    <Route path="user" element={<UserLayout />}>
      <Route index element={<UserHomepage />} />
      <Route path="notification" element={<Notifications />} />
      <Route path="request" element={<RequestForm />} />
      <Route path="profile" element={<Profile />} />
      <Route path="request-status" element={<RequestStatus />} />
      
          <Route path="/user/requests/:id" element={<RequestDetails />} />
       
      <Route path="howto" element={<HowTo />} />
      <Route path="faq" element={<FAQ />} /> {/* Added FAQ Route */}
      <Route path="support" element={<Support />} />
    </Route>
   
  
];

export default UserRoute;
