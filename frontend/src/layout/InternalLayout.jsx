import { Outlet } from "react-router-dom";
import InternalSidebar from "../components/internal/Sidebar";
import InternalNavbar from "../components/internal/Navbar";

const InternalLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <InternalNavbar />
      <div className="flex pt-16">
        <InternalSidebar />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default InternalLayout; 