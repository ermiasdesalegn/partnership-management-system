import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../components/dashboard/Index";
import ReqTableData from "../components/view-request/ReqTableData";
// import UserTableData from "../components/user-managment/UserTableData";
import BlogForm from "../components/blogs/BlogForm";
import Feedbacks from "../components/feedbacks/Feedbacks";
import AdminProfile from "../components/profile/Profile";
import AdminNotification from "../components/notification/Index";
import PartnerReports from "../components/partner/partner";
import PartnerDetail from "../components/partner/PartnerDetail";
import InProgress from "../components/inProgress/Index";
import ProgressDetail from "../components/inProgress/ProgressDetail";
import { Route } from "react-router";
import RegisteredUsers from "../components/user-managment/RegisteredUsers";
import InternalUsers from "../components/user-managment/InternalUsers";
import ExternalUsers from "../components/user-managment/ExternalUsers";
import ToBeReviewed from "../components/view-request/ToBeReviewed";
import RequestDetail from "../components/view-request/RequestDetail";
import ReviewedByYou from "../components/view-request/ReviewedByYou";
import SignedPartners from "../components/partner/SignedPartners";
import UnsignedPartners from "../components/partner/UnsignedPartners";
import ReviewedRequestDetail from "../components/view-request/ReviewedRequestDetail";
import StrategicPartners from "../components/partner/StrategicPartners";
import OperationalPartners from "../components/partner/OperationalPartners";
import ProjectPartners from "../components/partner/ProjectPartners";
import TacticalPartners from "../components/partner/TacticalPartners";

const AdminRoute = [
  <Route key={"admin"} path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="request" element={<ReqTableData />} />
    <Route path="requests-in-progress" element={<ToBeReviewed />} />
    <Route path="requests-in-progress/request/:id" element={<RequestDetail />} />
    <Route path="internal-user" element={<InternalUsers />} />
    <Route path="external-user" element={<ExternalUsers />} />
    <Route path="in-progress" element={<InProgress />} />
    <Route path="in-progress/:id" element={<ProgressDetail />} />
    <Route path="notifications" element={<AdminNotification />} />
    <Route path="profile" element={<AdminProfile />} />
    <Route path="Blogs-post" element={<BlogForm />} />
    <Route path="View-feedbacks" element={<Feedbacks />} />
    <Route path="partners" element={<PartnerReports />} />
    <Route path="partners/:id" element={<PartnerDetail />} />
    <Route path="partners/signed" element={<SignedPartners />} />
    <Route path="partners/unsigned" element={<UnsignedPartners />} />
    <Route path="partners/strategic" element={<StrategicPartners />} />
    <Route path="partners/operational" element={<OperationalPartners />} />
    <Route path="partners/project" element={<ProjectPartners />} />
    <Route path="partners/tactical" element={<TacticalPartners />} />
    <Route path="reviewed-requests" element={<ReviewedByYou />} />
    <Route path="reviewed-requests/:id" element={<ReviewedRequestDetail />} />
  </Route>,
];

export default AdminRoute;
