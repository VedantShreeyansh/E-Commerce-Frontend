import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await axios.post(`${backendUrl}/api/auth/register`, form, {
        credentials: true,
      });
      alert(res.data.message || "User registered successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
    <div className="p-8 max-w-md mx-auto custom-shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="mb-4 w-full p-2 border rounded focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="mb-4 w-full p-2 border rounded focus:outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="mb-4 w-full p-2 border rounded focus:outline-none"
        />
        <label className="block text-gray-700 font-bold mb-2">Role:</label>
        <select 
         name="role"
         value={form.role}
         onChange={handleChange}
         className="mb-4 w-full p-2 border rounded focus:outline-none"
         >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
         </select>
        <button
          type="submit"
          className="button1 bg-indigo-500 text-white px-4 py-2 rounded w-full hover:bg-indigo-600"
        >
          Register
        </button>
      </form>
      </div>
    </div>
  );
};

export default Register;