import { Outlet } from "react-router-dom";
import SideBar from "../Admin/manager/legal/sidebar/index";

const LegalLayout = () => {
  return (
    <div>
      <div className="flex ">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default LegalLayout;
