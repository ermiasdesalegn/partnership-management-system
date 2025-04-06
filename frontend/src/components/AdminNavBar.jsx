import { useState } from "react";
import {FaBell, FaUserCircle, FaCog, FaMoneyBill, FaSignOutAlt } from "react-icons/fa";
import logo from "../../../public/Logo_of_Ethiopian_INSA.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <nav className="fixed top-0 50 w-full bg-gray-200 border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            ></button>
            <a href="" className="flex ms-2 md:me-24">
              <img src={logo} className="h-10 me-3" alt="" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap ">
                PMS
              </span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  if (isDropdownOpen) {
                    setIsDropdownOpen(!isDropdownOpen);
                  }
                }}
              >
                <FaBell className="w-6 h-6 text-gray-600  hover:text-black hover:cursor-pointer " />
                {/* Notification Badge */}
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full hover:cursor-pointer  ">
                  3
                </span>
              </button>
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-300 rounded-lg shadow-lg ">
                  <div className="p-4 border-b border-gray-200 ">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    <li className="p-4 hover:bg-gray-100 ">
                      <a href="#" className="text-sm text-gray-900 ">
                        New request received
                      </a>
                    </li>
                    <li className="p-4 hover:bg-gray-100">
                      <a href="#" className="text-sm text-gray-700 0">
                        Request approved
                      </a>
                    </li>
                    <li className="p-4 hover:bg-gray-100">
                      <a href="#" className="text-sm text-gray-700">
                        Request declined
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* Profile Dropdown */}
            <div className="flex items-center ms-3 relative">
              <div>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    if (isNotificationOpen) {
                      setIsNotificationOpen(!isNotificationOpen);
                    }
                  }}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full hover:cursor-pointer"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                </button>
              </div>
              {isDropdownOpen && (
                <div className="z-50 absolute right-0 top-7 mt-2 text-base list-none bg-gray-300 divide-y divide-gray-100 rounded-lg shadow  w-48">
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm text-gray-900" role="none">
                      Admin
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate "
                      role="none"
                    >
                      pmsadmin@gmail.com
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FaUserCircle className="w-5 h-5 mr-2" />
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                        role="menuitem"
                      >
                        <FaCog className="w-5 h-5 mr-2" />
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FaMoneyBill className="w-5 h-5 mr-2" />
                        Earnings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                        role="menuitem"
                      >
                        <FaSignOutAlt className="w-5 h-5 mr-2" />
                        Sign out
                      </a>
                    </li>
                  </ul>
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
