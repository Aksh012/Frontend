import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import axios from "axios";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle link click to collapse sidebar
  const handleLinkClick = () => {
    setIsOpen(false); // Collapse the sidebar when a link is clicked
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No user is logged in.");
        return;
      }

      await axios.post(
        "https://saasbackend-380j.onrender.com/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      alert("Logout successful");
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-width duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
        style={{ overflow: "hidden" }} // Prevent sidebar from scrolling
      >
        {/* Toggle Button */}
        <button
          className="flex items-center justify-center h-16 focus:outline-none hover:bg-gray-700 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Arrow Icon */}
          <span className="text-2xl ml-5">{isOpen ? "<" : ">"}</span>
        </button>

        {/* Navigation Links */}
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              <NavLink
                to="/"
                onClick={handleLinkClick} // Collapse sidebar on click
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }
              >
                {isOpen ? "Dashboard" : "D"}
              </NavLink>
            </li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              <NavLink
                to="/analytics"
                onClick={handleLinkClick} // Collapse sidebar on click
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }
              >
                {isOpen ? "Analytics" : "A"}
              </NavLink>
            </li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              <NavLink
                to="/profile"
                onClick={handleLinkClick} // Collapse sidebar on click
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }
              >
                {isOpen ? "Settings" : "S"}
              </NavLink>
            </li>

            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              <NavLink
                to="/logout"
                onClick={handleLogout} // Collapse sidebar on click
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }
              >
                {isOpen ? "Logout" : "L"}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
