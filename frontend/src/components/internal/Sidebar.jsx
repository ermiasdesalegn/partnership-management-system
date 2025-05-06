import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  DocumentPlusIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const navigation = [
  { 
    name: "Dashboard", 
    href: "/internal/dashboard", 
    icon: HomeIcon,
    description: "Overview of your requests and activities"
  },
  { 
    name: "My Requests", 
    href: "/internal/requests", 
    icon: DocumentTextIcon,
    description: "View and manage your requests"
  },
  { 
    name: "New Request", 
    href: "/internal/request", 
    icon: DocumentPlusIcon,
    description: "Submit a new request"
  },
  { 
    name: "Profile", 
    href: "/internal/profile", 
    icon: UserCircleIcon,
    description: "Manage your profile information"
  }
];

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <>
      <div 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>

        <div className="p-4">
          <div className={`overflow-hidden transition-all duration-300 ${
            isCollapsed ? "w-12" : "w-full"
          }`}>
            <h2 className="text-lg font-semibold text-[#3c8dbc] whitespace-nowrap">
              {isCollapsed ? "INSA" : "INSA Internal"}
            </h2>
          </div>
        </div>

        <nav className="mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#3c8dbc] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <item.icon
                  className={`${
                    isCollapsed ? "w-8 h-8" : "w-5 h-5 mr-3"
                  } transition-all duration-200 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                <span className={`whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}>
                  {item.name}
                </span>

                {/* Tooltip */}
                {isCollapsed && hoveredItem === item.name && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap z-50">
                    <div className="absolute left-0 top-1/2 -ml-2 -mt-2 border-8 border-transparent border-r-gray-900" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-300 mt-1">{item.description}</p>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`} />
    </>
  );
};

export default Sidebar; 