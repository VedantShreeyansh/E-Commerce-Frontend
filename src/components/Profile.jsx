import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ email: "", username: "", profilePic: "" });
  const [newUsername, setNewUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now()); // Track upload status

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://localhost:5000";

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/profile`, {
          params: { email: user?.email },
          withCredentials: true,
        });
        setProfile(res.data);
        setNewUsername(res.data.username);
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data?.message || err.message);
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      }
    };

    if (user?.email) fetchProfile();
  }, [user, backendUrl, logout, navigate]);

  const handleUpdate = async () => {
    if (!profile.email) return alert("Email missing. Please log in again.");
    try {
      const res = await axios.patch(
        `${backendUrl}/api/auth/profile`,
        { email: profile.email, username: newUsername },
        { withCredentials: true }
      );
      alert(res.data.message);
      setProfile((prev) => ({ ...prev, username: newUsername }));
    } catch (err) {
      console.error("Error updating username:", err.response?.data?.message || err.message);
    }
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file.");
    if (!profile.email) return alert("Email missing. Please log in again.");
  
    const formData = new FormData();
    formData.append("profilePic", selectedFile);
    formData.append("email", profile.email);
  
    try {
      setIsUploading(true); // Start upload
      const res = await axios.post(`${backendUrl}/api/auth/upload-pic`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(res.data.message);
  
      // Fetch updated profile data
      const updatedProfile = await axios.get(`${backendUrl}/api/auth/profile`, {
        params: { email: profile.email },
        withCredentials: true,
      });
  
      // Update profile state with new profile picture
      setProfile((prev) => ({
        ...prev,
        profilePic: updatedProfile.data.profilePic, // Ensure profilePic is updated
      }));

      console.log("Updated profilePic URL:", updatedProfile.data.profilePic);

      setCacheBuster(Date.now()); // Update cache buster to refresh image
    } catch (err) {
      console.error("Upload error:", err.response?.data?.message || err.message);
    } finally {
      setIsUploading(false); // End upload
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="p-8 max-w-lg mx-auto custom-shadow rounded-xl w-full">
        {/* Header */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative w-24 h-24">
          <img
            src={
              profile.profilePic?.startsWith("http")
                ? `${profile.profilePic}?t=${cacheBuster}`
                : `${backendUrl}${profile.profilePic}?t=${cacheBuster}`
            }
            className="bg-transparent w-full h-full rounded-full object-cover border-4 border-white shadow-md"
          />
            {/* Upload "+" Icon */}
            <label
              htmlFor="fileInput"
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold cursor-pointer shadow-lg hover:bg-blue-700"
              title="Upload new picture"
            >
              +
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-600">Manage your account details</p>
          </div>
        </div>
  
        {/* File selected + Upload button */}
        <div className="flex flex-col items-center mb-6">
          {selectedFile && (
            <p className="text-sm text-gray-600 mb-2">
              Selected: {selectedFile.name}
            </p>
          )}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-5 py-2 rounded font-semibold transition ${
              isUploading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isUploading ? "Uploading..." : "Save Profile Picture"}
          </button>
        </div>
  
        {/* Email (read-only) */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Email:</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full p-3 border cursor-not-allowed rounded"
          />
        </div>
  
        {/* Username (editable) */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Username:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Update Username
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
