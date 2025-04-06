import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../components/dashboard/Index";
import ReqTableData from "../components/view-request/ReqTableData";
import UserTableData from "../components/user-managment/UserTableData";
import BlogForm from "../components/blogs/BlogForm";
import Feedbacks from "../components/feedbacks/Feedbacks";
import AdminProfile from "../components/profile/Profile";
import AdminNotification from "../components/notification/Index";
import PartnerReports from "../components/partner/partner";
import InProgress from "../components/inProgress/Index";
import ProgressDetail from "../components/inProgress/ProgressDetail";
import { Route } from "react-router";

const AdminRoute = [
  <Route key={"admin"} path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="request" element={<ReqTableData />} />
    <Route path="usersdata" element={<UserTableData />} />
    <Route path="in-progress" element={<InProgress />} />
    <Route path="in-progress/:id" element={<ProgressDetail />} />
    <Route path="notifications" element={<AdminNotification />} />
    <Route path="profile" element={<AdminProfile />} />
    <Route path="Blogs-post" element={<BlogForm />} />
    <Route path="View-feedbacks" element={<Feedbacks />} />
    <Route path="partners/*" element={<PartnerReports />} />
  </Route>,
];

export default AdminRoute;
