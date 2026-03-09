import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import logo from "../../assets/logo.jpg";

type Props = {
  onSuccess?: () => void; // kapag successful, tatawag sa parent para i-open login
  onSwitchToLogin?: () => void; // kapag gusto mag-switch sa login
};

export default function ClientRegister({ onSuccess, onSwitchToLogin }: Props) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("https://avidturerhotel.onrender.com/api/guests/register", formData);

      Swal.fire({
        icon: "success",
        title: "Registration Successful 🎉",
        text: "Welcome to AvidTurer Hotel Reservation System",
        confirmButtonColor: "#2563EB",
      });

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
      });

      // ✅ Close register modal and open login
      if (onSuccess) onSuccess();
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed ❌",
        text: err.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#DC2626",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Logo + Title */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={logo}
          alt="AvidTurer Hotel"
          className="w-20 h-20 rounded-full shadow-md mb-3"
        />
        <h2 className="text-2xl font-bold text-gray-800">
          Guest Registration
        </h2>
        <p className="text-sm text-gray-500 text-center">
          AvidTurer Hotel Reservation System
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      {/* Switch to Login */}
      <p className="mt-4 text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline font-medium"
        >
          Login here
        </button>
      </p>
    </div>
  );
}
