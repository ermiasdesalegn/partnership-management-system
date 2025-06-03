import { FiHome, FiSettings } from "react-icons/fi";
import {
  FaHandshake,
  FaPen,
  FaTh,
  FaUser,
  FaUsers,
  FaUsersCog,
} from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { MdFeedback } from "react-icons/md";

const optionsData = [
  {
    Icon: FiHome,
    title: "Dashboard",
    link: "/admin",
  },
  {
    Icon: FaUser,
    title: "Profile",
    link: "/admin/profile",
  },
  {
    Icon: FaTh,
    title: "View Requests",
    link: "/admin/request",
  },
  {
    Icon: FaUsersCog,
    title: "Requests for you",
    link: "/admin/requests-in-progress",
  },
  {
    Icon: FaUsersCog,
    title: "Reviewed Requests",
    link: "/admin/reviewed-requests",
  },
  {
    Icon: FaUsers,
    title: "User Management",
    link: "/admin/usersdata",
    dropdown: [
      {
        title: "Internal Users",
        link: "/admin/internal-user",
      },
      {
        title: "External Users",
        link: "/admin/external-user",
      },
      {
        title: "User Analytics",
        link: "/admin/user/summary",
      },
    ],
  },
  {
    Icon: FaHandshake,
    title: "Partners",
    link: "/admin/partners",
    dropdown: [
      {
        Icon: FaUsersCog,
        title: "All Partners",
        link: "/admin/partners",
      },
      {
        Icon: FaUsersCog,
        title: "Strategic ",
        link: "/admin/partners/strategic",
      },
      {
        Icon: FaUsersCog,
        title: "Operational ",
        link: "/admin/partners/operational",
      },
      {
        Icon: FaUsersCog,
        title: "Project ",
        link: "/admin/partners/project",
      },
      {
        Icon: FaUsersCog,
        title: "Tactical ",
        link: "/admin/partners/tactical",
      },
    ],
  },
  {
    Icon: MdFeedback,
    title: "View-feedbacks",
    link: "/admin/view-feedbacks",
  },
];

export default optionsData;
