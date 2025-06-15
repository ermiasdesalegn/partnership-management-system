import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigateTo = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigateTo("/login");
  };

  const handlePMSClick = () => {
    if (window.location.pathname !== "/user") {
      navigateTo("/user");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <nav className="bg-[#3c8dbc] shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* PMS Logo */}
            <button 
              onClick={handlePMSClick} 
              className="text-2xl font-light text-white hover:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}
            >
              PMS
            </button>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 ml-auto mr-8">
              <button 
                onClick={() => navigateTo("/user")} 
                className="text-white hover:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo("/user/howto")} 
                className="text-white hover:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}
              >
                How To
              </button>
              <button 
                onClick={() => navigateTo("/user/faq")} 
                className="text-white hover:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}
              >
                FAQ
              </button>
              <button 
                onClick={() => navigateTo("/user/feedback")} 
                className="text-white hover:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Feedback
              </button>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex text-sm rounded-full focus:outline-none">
                  <UserCircleIcon className="h-8 w-8 text-white hover:text-gray-100 transition-colors duration-300" />
                </Menu.Button>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/user/profile"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-[#3c8dbc]/10" : ""
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/user/request"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-[#3c8dbc]/10" : ""
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Send Request
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/user/request-status"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-[#3c8dbc]/10" : ""
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Request Status
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-[#3c8dbc]/10" : ""
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Log out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
