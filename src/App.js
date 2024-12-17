// App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Login from "./components/Login";
import Registration from "./components/Registration";
import AuthGuard from "./components/AuthGuard";
import Profile from "./components/Profile";
import axios from "axios";
import { DarkModeProvider } from "./context/DarkModeContext"; // Import DarkModeProvider
import ErrorBoundary from "./ErrorBoundary"; // Import ErrorBoundary

function App() {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "https://saasbackend-380j.onrender.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfileImage(
          response.data.profileImage ||
            "https://saasbackend-380j.onrender.com/uploads/default.png"
        );
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <DarkModeProvider>
      <Router>
        <ErrorBoundary>
          <div className="flex">
            <div className="sidebar">
              <Sidebar />
            </div>

            <div className="flex-1">
              <div className="navbar">
                {/* Pass profileImage to Navbar */}
                <Navbar profileImage={profileImage} />
              </div>

              <Routes>
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <Dashboard />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <AuthGuard>
                      <Analytics />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AuthGuard>
                      <Profile />
                    </AuthGuard>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
              </Routes>
            </div>
          </div>
        </ErrorBoundary>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
