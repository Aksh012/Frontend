// SalesPerformanceChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesPerformanceChart = () => {
  // Sample data for sales performance
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"], // Months
    datasets: [
      {
        label: "Sales ($)",
        data: [12000, 15000, 8000, 21000, 18000, 25000], // Sales figures
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Bar border color
        borderWidth: 1, // Border width
      },
    ],
  };

  // Chart options to customize appearance
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Sales Performance Over Time", // Chart title
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month", // x-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales ($)", // y-axis title
        },
        beginAtZero: true, // Start y-axis at 0
      },
    },
  };

  return (
    <div>
      <h2>Sales Performance Chart</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesPerformanceChart;
