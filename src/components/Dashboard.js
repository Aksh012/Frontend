import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./Chart";
import SalesPerformanceChart from "./Salesperformance";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Persist dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [dashboardResponse, revenueResponse, sessionResponse] =
        await Promise.all([
          axios.get(
            "https://saasbackend-380j.onrender.com/api/dashboard/data",
            config
          ),
          axios.get(
            "https://saasbackend-380j.onrender.com/api/dashboard/revenue-history",
            config
          ),
          axios.get(
            "https://saasbackend-380j.onrender.com/api/dashboard/session-history",
            config
          ),
        ]);

      // console.log("Dashboard Response:", dashboardResponse.data); // Debug log

      setDashboardData(dashboardResponse.data);
      setRevenueHistory(revenueResponse.data);
      setSessionHistory(sessionResponse.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      } p-4 sm:p-6 md:p-10 lg:p-12 overflow-x-hidden`}
      style={{ marginLeft: "3.5rem" }} // Offset for the fixed sidebar
    >
      {/* Title */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center md:text-left">
        Dashboard Overview
      </h2>

      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded">
          <p className="text-sm font-medium">Total Users</p>
          <p className="text-lg font-bold">{dashboardData?.totalUsers || 0}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded">
          <p className="text-sm font-medium">Total Sessions</p>
          <p className="text-lg font-bold">{dashboardData?.totalSessions || 0}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded">
          <p className="text-sm font-medium">Total Revenue</p>
          <p className="text-lg font-bold">
            ${dashboardData?.totalRevenue?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Grid Section */}

      <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
        <Chart />
      </div>

      {/* Revenue History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Revenue History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border bg-white dark:bg-gray-800 shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenueHistory.map((record) => (
                <tr key={record._id}>
                  <td className="p-2 border">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">${record.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Session History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border bg-white dark:bg-gray-800 shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-2 border">User</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Start Time</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessionHistory.map((session) => (
                <tr key={session.sessionId}>
                  <td className="p-2 border">{session.userName}</td>
                  <td className="p-2 border">{session.email}</td>
                  <td className="p-2 border">
                    {new Date(session.startTime).toLocaleString()}
                  </td>
                  <td className="p-2 border">{session.duration}</td>
                  <td className="p-2 border">
                    <span
                      className={`font-semibold ${
                        session.status === "active"
                          ? "text-green-500"
                          : session.status === "expired"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Performance */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Sales Performance</h2>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
          <SalesPerformanceChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
