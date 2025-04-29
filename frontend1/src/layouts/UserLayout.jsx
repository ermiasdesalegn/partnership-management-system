import { Outlet } from "react-router-dom";
import NavBar from "../components/user/NavBar";
import Footer from "../components/common/Footer";

const UserLayout = () => {
  return (
    <div>
      <NavBar />
      <div className="pt-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
