import { Outlet } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <div>
      <NavBar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
    
  );
};

export default MainLayout;
