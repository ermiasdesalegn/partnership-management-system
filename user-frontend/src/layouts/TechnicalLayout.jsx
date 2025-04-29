import { Outlet } from "react-router-dom";
import SideBar from "../Admin/manager/technical/sidebar/index";

const TechnicalLayout = () => {
  return (
    <div>
      <div className="flex ">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default TechnicalLayout;
