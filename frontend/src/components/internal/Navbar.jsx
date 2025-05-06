import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/internal/login");
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu || showNotifications) {
        if (!event.target.closest('.menu-container')) {
          setShowProfileMenu(false);
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu, showNotifications]);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-[#3c8dbc]">
              INSA Internal Portal
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative menu-container">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 relative group"
              >
                <BellIcon className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform transition-transform duration-200 group-hover:scale-125"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-20 transform transition-all duration-200 origin-top">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-600">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative menu-container">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 group"
              >
                <UserCircleIcon className="h-8 w-8 transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden md:block font-medium">{user?.name || 'User'}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 transform transition-all duration-200 origin-top">
                  <button
                    onClick={() => navigate('/internal/profile')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <UserCircleIcon className="h-5 w-5 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 