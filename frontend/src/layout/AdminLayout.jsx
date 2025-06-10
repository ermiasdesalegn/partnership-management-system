import { Outlet } from "react-router-dom";
import SideBar from "../components/sidebar/index";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="px-4 md:px-6 lg:px-8 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
