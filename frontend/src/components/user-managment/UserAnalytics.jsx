import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getAllInternalUsers, getAllExternalUsers } from "../../api/adminApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UserAnalytics = () => {
  const navigate = useNavigate();

  // Fetch all users data using React Query
  const { data: allUsers = [], isLoading: isLoadingAllUsers, error: allUsersError } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  const { data: internalUsers = [], isLoading: isLoadingInternal, error: internalError } = useQuery({
    queryKey: ["internalUsers"],
    queryFn: getAllInternalUsers,
  });

  const { data: externalUsers = [], isLoading: isLoadingExternal, error: externalError } = useQuery({
    queryKey: ["externalUsers"],
    queryFn: getAllExternalUsers,
  });

  // Calculate analytics using useMemo for performance
  const analytics = useMemo(() => {
    if (!allUsers.length || !internalUsers.length || !externalUsers.length) {
      return {
        totalUsers: 0,
        internalUsers: 0,
        externalUsers: 0,
        departmentBreakdown: {},
        requestActivity: {},
        usersByRequestCount: [],
        topDepartments: [],
        recentRegistrations: 0
      };
    }

    // Calculate department breakdown
    const departmentBreakdown = {};
    internalUsers.forEach(user => {
      const dept = user.department || 'Unknown';
      departmentBreakdown[dept] = (departmentBreakdown[dept] || 0) + 1;
    });

    // Calculate request activity distribution
    const requestActivity = {
      noRequests: 0,
      lowActivity: 0,    // 1-3 requests
      mediumActivity: 0, // 4-10 requests
      highActivity: 0    // 11+ requests
    };

    allUsers.forEach(user => {
      if (user.requestCount === 0) {
        requestActivity.noRequests++;
      } else if (user.requestCount <= 3) {
        requestActivity.lowActivity++;
      } else if (user.requestCount <= 10) {
        requestActivity.mediumActivity++;
      } else {
        requestActivity.highActivity++;
      }
    });

    // Get users sorted by request count for top active users
    const usersByRequestCount = allUsers
      .sort((a, b) => b.requestCount - a.requestCount)
      .slice(0, 10);

    // Get top departments by user count
    const topDepartments = Object.entries(departmentBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Calculate recent registrations (this month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Debug logging
    console.log('Current date:', now);
    console.log('Start of month:', startOfMonth);
    console.log('Sample user data:', allUsers.slice(0, 2));
    
    const recentRegistrations = allUsers.filter(user => {
      if (!user.createdAt) {
        console.log('User without createdAt:', user);
        return false;
      }
      const userCreatedAt = new Date(user.createdAt);
      const isThisMonth = userCreatedAt >= startOfMonth;
      if (isThisMonth) {
        console.log('User registered this month:', user.name, userCreatedAt);
      }
      return isThisMonth;
    }).length;
    
    console.log('Recent registrations count:', recentRegistrations);

    return {
      totalUsers: allUsers.length,
      internalUsers: internalUsers.length,
      externalUsers: externalUsers.length,
      departmentBreakdown,
      requestActivity,
      usersByRequestCount,
      topDepartments,
      recentRegistrations
    };
  }, [allUsers, internalUsers, externalUsers]);

  // Handle loading states
  const isLoading = isLoadingAllUsers || isLoadingInternal || isLoadingExternal;
  const error = allUsersError || internalError || externalError;

  // Chart configurations
  const userTypeChartData = {
    labels: ['Internal Users', 'External Users'],
    datasets: [
      {
        data: [analytics.internalUsers, analytics.externalUsers],
        backgroundColor: ['#3c8dbc', '#00a65a'],
        borderColor: ['#367fa9', '#008d4c'],
        borderWidth: 1,
      },
    ],
  };

  const departmentChartData = {
    labels: analytics.topDepartments.map(([dept]) => dept),
    datasets: [
      {
        label: 'Users by Department',
        data: analytics.topDepartments.map(([, count]) => count),
        backgroundColor: [
          '#3c8dbc',
          '#00a65a',
          '#f39c12',
          '#dd4b39',
          '#605ca8'
        ],
        borderColor: [
          '#367fa9',
          '#008d4c',
          '#e08e0b',
          '#d33724',
          '#555299'
        ],
        borderWidth: 1,
      },
    ],
  };

  const requestActivityChartData = {
    labels: ['No Requests', 'Low Activity (1-3)', 'Medium Activity (4-10)', 'High Activity (11+)'],
    datasets: [
      {
        label: 'Users by Request Activity',
        data: [
          analytics.requestActivity.noRequests,
          analytics.requestActivity.lowActivity,
          analytics.requestActivity.mediumActivity,
          analytics.requestActivity.highActivity
        ],
        backgroundColor: ['#dd4b39', '#f39c12', '#00a65a', '#3c8dbc'],
        borderColor: ['#d33724', '#e08e0b', '#008d4c', '#367fa9'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-[#3c8dbc]/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#3c8dbc]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error?.message || "Failed to fetch analytics data"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container sm:px-6 lg:px-4 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3c8dbc]">User Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">Comprehensive overview of user statistics and activity</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#3c8dbc]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-[#3c8dbc] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd className="text-lg font-medium text-gray-900">{analytics.totalUsers}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zm-6 7a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Internal Users</dt>
                <dd className="text-lg font-medium text-gray-900">{analytics.internalUsers}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">External Users</dt>
                <dd className="text-lg font-medium text-gray-900">{analytics.externalUsers}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 6V4l-2-2H6a2 2 0 00-2 2v3h2V4h4v2h2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">New This Month</dt>
                <dd className="text-lg font-medium text-gray-900">{analytics.recentRegistrations}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Type Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Type Distribution</h3>
          <div className="h-64">
            <Pie data={userTypeChartData} options={chartOptions} />
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Departments</h3>
          <div className="h-64">
            <Bar data={departmentChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Request Activity Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity by Request Count</h3>
        <div className="h-64">
          <Bar data={requestActivityChartData} options={chartOptions} />
        </div>
      </div>

      {/* Top Active Users Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3c8dbc]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Requests
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.usersByRequestCount.map((user, index) => (
                <tr key={user._id} className="hover:bg-[#3c8dbc]/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.type === 'internal' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.type || 'external'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3c8dbc] font-medium">
                    {user.requestCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics; 