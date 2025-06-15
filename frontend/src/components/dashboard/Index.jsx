import React from "react";
import { StatisticsCard } from "./StatisticCard";
import {
  FaHandshake,
  FaChartPie,
  FaFileAlt,
  FaUserPlus,
  FaHourglassHalf,
  FaClock,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
import SimpleLineChart from "./Graph";
import TickPlacementBars from "./Bar";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatistics, logout, fetchRequestStatusCounts } from "../../api/adminApi";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useQuery({
    queryKey: ["dashboardStatistics"],
    queryFn: getDashboardStatistics,
  });

  const { data: statusCounts, isLoading: isStatusLoading, error: statusError } = useQuery({
    queryKey: ["requestStatusCounts"],
    queryFn: fetchRequestStatusCounts,
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isDashboardLoading || isStatusLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#3c8dbc]" />
      </div>
    );
  }

  if (dashboardError || statusError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-red-500">
        Error: {dashboardError?.message || statusError?.message}
      </div>
    );
  }

const statisticsCardsData = [
  {
    color: "blue",
    icon: FaHandshake,
    title: "Total Partnerships",
      value: dashboardData?.statistics.totalPartners.toString() || "0",
    footer: {
      color: "text-green-500",
        value: `${dashboardData?.statistics.signedPartners} signed`,
        label: `${dashboardData?.statistics.unsignedPartners} unsigned`,
    },
  },
  {
    color: "green",
    icon: FaChartPie,
      title: "Active Partners",
      value: dashboardData?.statistics.activePartners.toString() || "0",
    footer: {
      color: "text-green-500",
        value: "Active",
        label: "partnerships",
    },
  },
  {
    color: "orange",
      icon: FaFileAlt,
      title: "Total Requests",
      value: dashboardData?.statistics.totalRequests.toString() || "0",
    footer: {
        color: "text-blue-500",
        value: "All time",
        label: "requests",
    },
  },
  {
    color: "purple",
    icon: FaUserPlus,
      title: "New Requests",
      value: dashboardData?.statistics.newRequestsLastYear.toString() || "0",
    footer: {
      color: "text-blue-500",
        value: "Last year",
        label: "requests",
    },
  },
];

const requestStatusCardsData = [
  {
    color: "orange",
    icon: FaHourglassHalf,
    title: "In Review",
    value: statusCounts?.inReview?.toString() || "0",
    footer: {
      color: "text-orange-500",
      value: "Currently",
      label: "in review",
    },
  },
  {
    color: "blue",
    icon: FaClock,
    title: "pending",
    value: statusCounts?.pending?.toString() || "0",
    footer: {
      color: "text-blue-500",
      value: "Awaiting",
      label: "review",
    },
  },
  {
    color: "red",
    icon: FaTimesCircle,
    title: "disapproved",
    value: statusCounts?.disapproved?.toString() || "0",
    footer: {
      color: "text-red-500",
      value: "Total",
      label: "disapproved",
    },
  },
  {
    color: "green",
    icon: FaCheckCircle,
    title: "approved",
    value: statusCounts?.approved?.toString() || "0",
    footer: {
      color: "text-green-500",
      value: "Total",
      label: "approved",
    },
  },
];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full min-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Overview of partnerships and requests
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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

        {/* New row for request status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {requestStatusCardsData.map(({ icon, title, footer, ...rest }) => (
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Statistics</h2>
            <div className="h-[400px] sm:h-[500px]">
              <SimpleLineChart monthlyStats={dashboardData?.monthlyStats} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
            <div className="h-[400px] sm:h-[500px]">
              <TickPlacementBars monthlyStats={dashboardData?.monthlyStats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
