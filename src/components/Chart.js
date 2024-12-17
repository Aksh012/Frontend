import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

// Register the required chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const SessionHistoryChart = () => {
  const [sessionData, setSessionData] = useState({
    datasets: [
      {
        label: "User Session Start Times",
        data: [], // Data for the chart
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://saasbackend-380j.onrender.com/api/dashboard/session-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sessions = response.data;

        // Map session start times to data points for the graph
        const sessionPoints = sessions.map((session) => ({
          x: new Date(session.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }), // Time
          y: new Date(session.startTime).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
          }), // Date
        }));

        setSessionData({
          datasets: [
            {
              label: "Session Start Times",
              data: sessionPoints,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.1,
              pointRadius: 5,
              pointHoverRadius: 8,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Session Start Times",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const { x, y } = context[0].raw;
            return `Date: ${y}, Time: ${x}`;
          },
          label: () => "Session Start",
        },
      },
    },
    scales: {
      x: {
        type: "category", // X-axis shows session start times
        title: {
          display: true,
          text: "Time of Day",
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        type: "category", // Y-axis shows dates
        title: {
          display: true,
          text: "Date",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "400px" }}>
      <Line data={sessionData} options={options} />
    </div>
  );
};

export default SessionHistoryChart;
