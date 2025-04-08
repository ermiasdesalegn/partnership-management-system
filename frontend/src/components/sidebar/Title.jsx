/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const TitleSection = ({ open }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/v1/admin/logout", {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogoutClick = () => {
    if (!showConfirm) {
      setShowConfirm(true);
    } else {
      handleLogout();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && showConfirm) {
      handleLogout();
    }
  };

  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex items-center justify-between rounded-md">
        <div className="flex items-center gap-2">
          <FaUserCircle className="mr-2" size={20} />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-bold">INSA PMS</span>
              <span className="block text-xs text-slate-500">Admin</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center">
          {showConfirm && open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mr-2 text-xs text-red-600"
            >
              Confirm?
            </motion.span>
          )}
          <BiLogOut 
            onClick={handleLogoutClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            className="mr-2 cursor-pointer text-red-600 transition-colors hover:text-red-700"
          />
        </div>
      </div>
    </div>
  );
};

export default TitleSection;