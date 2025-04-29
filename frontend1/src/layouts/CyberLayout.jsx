import { Outlet } from "react-router-dom";
import SideBar from "../Admin/manager/cyber/sidebar/index";

const CyberLayout = () => {
  return (
    <div>
      <div className="flex ">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default CyberLayout;
