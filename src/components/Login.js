import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between Login and Registration forms
  const [name, setName] = useState(""); // Name state for registration form
  const [error, setError] = useState(""); // Error state for displaying registration errors
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://saasbackend-380j.onrender.com/api/login",
        {
          email,
          password,
        }
      );
      const { token } = response.data;

      // Store JWT token in localStorage
      localStorage.setItem("token", token);

      // Redirect to Dashboard or another page
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error.response.data.error);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "https://saasbackend-380j.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // On success, show a message and redirect to login
      alert("Registration successful! Please log in.");
      setIsRegistering(false); // Switch to login form after successful registration
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100"
      style={{
        marginLeft: "5rem", // Offset for the sidebar
        overflowX: "hidden", // Prevent horizontal scrolling
      }}
    >
      <div className="bg-white p-6 rounded shadow-md w-full sm:w-96">
        {isRegistering ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Register</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md"
              >
                Register
              </button>
            </form>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <span
                onClick={() => setIsRegistering(false)}
                className="text-blue-500 cursor-pointer"
              >
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white p-2 w-full rounded"
            >
              Login
            </button>
            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <span
                onClick={() => setIsRegistering(true)}
                className="text-blue-500 cursor-pointer"
              >
                Register
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
