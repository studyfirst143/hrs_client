import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

import Form from "../../components/Form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import logo from "../../assets/logo.jpg";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);

      Swal.fire({
        icon: "success",
        title: "Login Successful 🎉",
        text: "Welcome back!",
        confirmButtonColor: "#2563EB",
      }).then(() => {
        navigate("/dashboard/home");
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text:
          err.response?.data?.message ||
          "Invalid email or password",
        confirmButtonColor: "#DC2626",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-100 to-blue-200">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Hotel Logo"
            className="w-24 h-24 rounded-full"
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-blue-700">
          Admin / Staff Login
        </h1>

        <Form onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin"
            required
          />

          <Button
            label="Login"
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
          />
        </Form>
      </div>
    </div>
  );
};

export default AdminLogin;
