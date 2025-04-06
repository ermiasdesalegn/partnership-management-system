import { FiHome, FiSettings } from "react-icons/fi";
import { FaPen, FaTh, FaUser, FaUsers } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { MdFeedback } from "react-icons/md";
import Badge from "./Badge";

const optionsData = [
  {
    Icon: FiHome,
    title: "Dashboard",
    link: "/admin",
  },
  {
    Icon: FaUser,
    title: "Profile",
    link: "profile",
  },
  {
    Icon: MdFeedback,
    title: "Requests",
    link: "requests",
  },
  {
    Icon: IoMdNotifications,
    badge: Badge,
    title: "Notifications",
    link: "notifications",
    notifs: 3,
  }
];

export default optionsData;
