import { Outlet } from "react-router-dom";
import SideBar from "../components/sidebar/index";

const AdminLayout = () => {
  return (
    <div>
      <div className="flex ">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
