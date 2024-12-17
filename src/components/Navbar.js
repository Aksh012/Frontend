import React from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { Menu } from "@headlessui/react";

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Analytics", href: "/analytics", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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

export default function Navbar({ profileImage }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  // Update navigation array with current path
  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current: location.pathname === item.href, // Compare current location with the href
  }));

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-1 items-center justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto sm:ml-5 ml-10"
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {updatedNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center">
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <img
                    alt="User Profile"
                    src={
                      profileImage ||
                      "https://saasbackend-380j.onrender.com/uploads/default.png"
                    }
                    className="h-8 w-8 rounded-full"
                  />
                </Menu.Button>
              </div>
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Settings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
