import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext"; // import the dark mode context

const Profile = () => {
  const { darkMode, toggleDarkMode } = useDarkMode(); // Use context to access dark mode state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get(
          "https://saasbackend-380j.onrender.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          password: "",
        });
        setSkills(response.data.skills || []);
        setProfileImage(response.data.profileImage || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://saasbackend-380j.onrender.com/api/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(response.data.user);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.error || "Failed to update profile.");
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !yearsOfExperience.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://saasbackend-380j.onrender.com/api/profile/skills",
        { skill: newSkill, yearsOfExperience: parseInt(yearsOfExperience) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSkills(response.data.skills);
      setNewSkill("");
      setYearsOfExperience("");
    } catch (err) {
      console.error("Error adding skill:", err);
      setError(err.response?.data?.error || "Failed to add skill.");
    }
  };

  const handleProfileImageChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.error("No file selected.");
      return;
    }

    const file = files[0];

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://saasbackend-380j.onrender.com/api/profile/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfileImage(response.data.profileImage);
    } catch (err) {
      console.error("Error uploading profile image:", err);
      setError("Failed to upload profile image.");
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      } overflow-x-hidden`}
      style={{ marginLeft: "3.5rem" }} // Offset for the sidebar
    >
      <div className="flex justify-center items-center py-6">
        <div
          className={`w-full max-w-3xl p-6 shadow-lg rounded-lg grid gap-6 md:grid-cols-2 lg:grid-cols-3`}
        >
          {/* Profile Info & Image Section */}
          <div className="col-span-3 md:col-span-1 flex flex-col items-center">
            {/* Profile Image */}
            <img
              src={
                profileImage ||
                "https://saasbackend-380j.onrender.com/uploads/default.png"
              }
              alt="Profile"
              className="mx-auto rounded-full w-32 h-32 object-cover mb-4"
            />
            <h1 className="text-3xl font-semibold">Profile</h1>

            {editMode ? (
              <div className="space-y-4 mt-6 w-full">
                <h2 className="text-2xl">Edit Profile</h2>
                <input
                  className={`w-full p-2 border rounded ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white"
                  }`}
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  className={`w-full p-2 border rounded ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white"
                  }`}
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  className={`w-full p-2 border rounded ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white"
                  }`}
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center mt-4">
                <p>
                  <strong>Name:</strong> {profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Edit Profile
                </button>
              </div>
            )}

            {/* Dark Mode Toggle Button inside Profile Section */}
            <button
              onClick={toggleDarkMode}
              className={`mt-4 p-2 rounded ${
                darkMode ? "bg-yellow-500" : "bg-gray-500"
              } text-white`}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Skills Section */}
          <div className="col-span-3 md:col-span-2">
            <h2 className="text-2xl">Skills</h2>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>{skill.skill}</span>
                  <span>{skill.yearsOfExperience} years</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex sm:flex-row flex-col space-x-4">
              <input
                className={`w-full sm:w-2/3 p-2 mt-5 border rounded ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white"
                }`}
                type="text"
                placeholder="Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <input
                className={`w-full sm:w-2/3 p-2 mt-5 border rounded ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white"
                }`}
                type="number"
                placeholder="Years of Experience"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
              />
              <button
                onClick={handleAddSkill}
                className="bg-blue-500 mt-5 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Profile Image Upload Section */}
          <div className="col-span-3 mt-6 flex flex-col items-center">
            <h2 className="text-2xl">Update Profile Image</h2>
            <div className="mt-4 text-center sm:flex sm:flex-row flex-col">
              <input
                type="file"
                onChange={handleProfileImageChange}
                className={`border p-2 sm:w-fit w-52 rounded mt-4 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white"
                }`}
              />
              <button
                onClick={handleProfileImageChange}
                className="mt-4 sm:ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
