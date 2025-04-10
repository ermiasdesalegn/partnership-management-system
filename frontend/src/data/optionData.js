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
import Badge from "./../components/common/Badge";

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
    title: "  Requests on your Review",
    link: "/admin/requests-in-progress",
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
  // {
  //   Icon: FaHandshake,
  //   title: "Strategic Partner",
  //   link: "/admin/partner/strategic",
  // },
  // {
  //   Icon: FaHandshake,
  //   title: "Operational Partner",
  //   link: "/admin/partner/operational",
  // },
  // {
  //   Icon: FaHandshake,
  //   title: "Project Partner",
  //   link: "/admin/partner/project",
  // },
  // {
  //   Icon: FaHandshake,
  //   title: "Tactical Partner",
  //   link: "/admin/partner/tactical",
  // },
  // {
  //   Icon: FaPen,
  //   title: "Blogs-post",
  //   link: "/admin/blogs-post",
  // },
  {
    Icon: MdFeedback,
    title: "View-feedbacks",
    link: "/admin/view-feedbacks",
  },

  // {
  //   Icon: IoMdNotifications,
  //   badge: Badge,
  //   title: "Notifications",
  //   link: "/admin/notifications",
  //   notifs: 3,
  // },
  // {
  //   Icon: FiSettings,
  //   title: "Settings",
  //   link: "/admin/settings",
  // },
];

export default optionsData;
