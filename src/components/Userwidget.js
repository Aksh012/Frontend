import React, { useEffect, useState } from "react";
import axios from "axios";

const UserWidget = () => {
  const [userData, setUserData] = useState([]);

  // Fetch users data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "https://saasbackend-380j.onrender.com/api/users"
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Ensure userData is an array before mapping
  if (!Array.isArray(userData)) {
    return <div>No users available.</div>;
  }

  return (
    <div className=" bg-yellow-50">
      <h3 className="text-xl font-semibold mb-4">Users List</h3>
      <ul>
        {userData.length === 0 ? (
          <li>No users found.</li>
        ) : (
          userData.map((user) => (
            <li key={user._id} className="mb-2">
              {user.name} ({user.email})
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UserWidget;
