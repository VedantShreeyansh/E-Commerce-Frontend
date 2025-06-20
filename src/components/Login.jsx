import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

axios.defaults.withCredentials = true;

const Login = () => {
  
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; // Use environment variable or fallback to localhost
      const res = await axios.post(`${backendUrl}/api/auth/login`, form, {
        credentials: true,
      });
      if (res.data.user) {
        login(res.data.user);
        navigate("/home");
      } else {
        throw new Error("Invalid user data received from the server.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };
  
  return (
   <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
    <div className="p-8 max-w-md mx-auto custom-shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="mb-4 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="mb-4 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="button1 bg-indigo-500 text-white px-4 py-2 rounded w-full hover:bg-indigo-600"
        >
          Login
        </button>
      </form>
    </div>
    </div>
  );
};

export default Login;