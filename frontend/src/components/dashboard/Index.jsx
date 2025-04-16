import React from "react";
import { StatisticsCard } from "./StatisticCard";
import {
  FaHandshake,
  FaChartPie,
  FaDollarSign,
  FaUserPlus,
} from "react-icons/fa"; // Relevant icons for PMS
import SimpleLineChart from "./Graph";
import TickPlacementBars from "./Bar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Updated static data for PMS-related cards
const statisticsCardsData = [
  {
    color: "blue",
    icon: FaHandshake,
    title: "Total Partnerships",
    value: "120",
    footer: {
      color: "text-green-500",
      value: "+15%",
      label: "growth this quarter",
    },
  },
  {
    color: "green",
    icon: FaChartPie,
    title: "Active Collaborations",
    value: "78",
    footer: {
      color: "text-green-500",
      value: "+10%",
      label: "increase this month",
    },
  },
  {
    color: "orange",
    icon: FaDollarSign,
    title: "Revenue Generated",
    value: "$350,000",
    footer: {
      color: "text-green-500",
      value: "+8%",
      label: "compared to last month",
    },
  },
  {
    color: "purple",
    icon: FaUserPlus,
    title: "New Partnerships",
    value: "25",
    footer: {
      color: "text-blue-500",
      value: "steady",
      label: "compared to last quarter",
    },
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/v1/admin/logout", {
        withCredentials: true,
      });
      navigate("/admin/login"); // 👈 redirects user after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="py-1 px-2 mt-15">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <p className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </p>
            }
          />
        ))}
      </div>
      <div className="grid grid-cols-2">
        <SimpleLineChart />
        <TickPlacementBars />
      </div>
      <button className="" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
