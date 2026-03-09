import { useState } from "react";
import logo from "../../assets/logo.jpg";
import Swal from "sweetalert2";
import { useAuthClient } from "../../context/AuthClientContext";

type Props = {
  onSuccess?: () => void; // kapag successful login
  onSwitchToRegister?: () => void; // switch sa register modal
};

export default function ClientLogin({ onSuccess, onSwitchToRegister }: Props) {
  const { login } = useAuthClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Please fill in all fields",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://avidturerhotel.onrender.com/api/guests/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed ❌",
          text: data.message || "Invalid credentials",
          confirmButtonColor: "#DC2626",
        });
        return;
      }

      // SAVE LOGIN DATA
      login(data.token, data.guest);

      await Swal.fire({
        icon: "success",
        title: "Login Successful 🎉",
        text: `Welcome, ${data.guest.fullName}!`,
        confirmButtonColor: "#2563EB",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Try again.",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="w-full px-4 sm:px-6 md:px-0 max-w-md mx-auto bg">
    <div className="flex flex-col items-center mb-6 ">
      <img src={logo} className="h-20 w-20 rounded-full shadow mb-3" />
      <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
      <p className="text-sm text-gray-500 text-center">
        AvidTurer Hotel Reservation System
      </p>
    </div>

    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email address"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>

    <p className="mt-4 text-center text-gray-600 text-sm">
      Don't have an account?{" "}
      <button
        onClick={onSwitchToRegister}
        className="text-green-600 hover:underline font-medium"
      >
        Signup here
      </button>
    </p>
  </div>
);
}
