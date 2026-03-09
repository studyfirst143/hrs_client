import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";
import logo from "../assets/logo.jpg";

type NavItem = {
  label: string;
  path: string;
};

interface TopBarProps {
  navItems: NavItem[];
}

const TopBar: React.FC<TopBarProps> = ({ navItems }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Auto close dropdown when screen becomes desktop
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md fixed w-full top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} className="w-10 h-10 rounded-full" />
            <span className="font-bold text-blue-700 text-lg">Hotel Admin</span>
          </div>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition
                  ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-blue-100"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}

            {/* Profile Desktop */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}>
                <UserCircleIcon className="w-8 h-8 text-gray-700 hover:text-blue-600 transition" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-2xl border animate-slideDown">
                  <div className="p-4 border-b flex items-center gap-3">
                    <UserCircleIcon className="w-10 h-10 text-blue-600" />
                    <div>
                      <p className="font-semibold">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-100 transition"
                  >
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    View Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 transition rounded-b-2xl"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ================= MOBILE ICONS ================= */}
          <div className="md:hidden flex gap-2">
            <button onClick={() => setProfileOpen(!profileOpen)}>
              <UserCircleIcon className="w-8 h-8 text-gray-700" />
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <XMarkIcon className="w-7 h-7" />
              ) : (
                <Bars3Icon className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE DROPDOWN MENU ================= */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-b rounded-b-2xl animate-slideDown z-40">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500">
              Navigation
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 mx-3 mb-2 rounded-lg text-sm font-medium transition
                  ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow"
                      : "hover:bg-blue-100 text-gray-700"
                  }
                `}
              >
                • {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* ================= MOBILE PROFILE DROPDOWN ================= */}
        {profileOpen && (
          <div className="md:hidden absolute right-4 top-16 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl w-64 border z-50 animate-slideDown">

            <div className="p-4 border-b flex items-center gap-3">
              <UserCircleIcon className="w-10 h-10 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowProfileModal(true);
                setProfileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-100 transition"
            >
              <UserIcon className="w-5 h-5 text-blue-600" />
              View Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 transition rounded-b-2xl"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* ================= PROFILE MODAL ================= */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default TopBar;
