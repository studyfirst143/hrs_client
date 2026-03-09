import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";
import logo from "../../assets/logo.jpg";

// Role options
const roles = [
  { label: "Admin", value: "admin" },
  { label: "Staff", value: "staff" },
];

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    assignedBranch: "",
    role: "",
  });

  // Update input/select fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🔑 prevent page reload

    if (!formData.role) {
      Swal.fire({
        icon: "warning",
        title: "Please select a role",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    try {
      await axios.post("https://avidturerhotel.onrender.com/api/users/register", formData);

      Swal.fire({
        icon: "success",
        title: "Registration Successful 🎉",
        text: `User ${formData.username} has been registered`,
        confirmButtonColor: "#2563EB",
      }).then(() => {
        navigate("/"); // redirect to login
      });
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-100 to-blue-200">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 space-y-6">

        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Hotel Logo" className="w-24 h-24 rounded-full" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Admin / Staff Registration
        </h1>
        <p className="text-center text-gray-500 text-sm">
          Create a new administrator or staff account
        </p>

        {/* Form */}
        <Form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Juan Dela Cruz"
          />

          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="admin01"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@hotel.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
          />

          <Input
            label="Assigned Branch"
            name="assignedBranch"
            value={formData.assignedBranch}
            onChange={handleChange}
            placeholder="Main Branch"
          />

          {/* Role select */}
          <Select
            label="Role"
            name="role"
            value={formData.role}
            options={roles}
            onChange={handleChange}
          />

          <Button
            label="Register User"
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
          />
        </Form>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
