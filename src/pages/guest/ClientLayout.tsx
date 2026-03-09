import { useRef, useState, useEffect } from "react";
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import logo from "../../assets/logo.jpg";

import Home from "./Home";
import BookRoom from "./BookRoom";
import MyReservations from "./MyReservation";
import ClientLogin from "./ClientLogin";
import ClientRegister from "./ClientRegister";

import { useAuthClient } from "../../context/AuthClientContext";

export default function ClientLayout() {
  const { isAuthenticated, guest, logout } = useAuthClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const homeRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const reservationsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    if (section === "home") homeRef.current?.scrollIntoView({ behavior: "smooth" });
    if (section === "book") bookRef.current?.scrollIntoView({ behavior: "smooth" });
    if (section === "reservations") reservationsRef.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const navClass = (section: string) =>
    `px-3 py-2 rounded-md transition ${
      activeSection === section
        ? "bg-blue-600 text-white"
        : "hover:bg-blue-100 hover:text-blue-700"
    }`;

  // Auto close dropdown kapag resize to desktop
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= TOPBAR ================= */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img src={logo} className="h-10 w-10 rounded-full" />
            <span className="font-bold text-xl text-blue-700">AvidTurer Hotel</span>
          </div>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden md:flex items-center gap-3">
            <button onClick={() => scrollToSection("home")} className={navClass("home")}>
              Home
            </button>

            {isAuthenticated && (
              <>
                <button onClick={() => scrollToSection("book")} className={navClass("book")}>
                  Book Room
                </button>
                <button onClick={() => scrollToSection("reservations")} className={navClass("reservations")}>
                  My Reservations
                </button>
              </>
            )}

            {!isAuthenticated ? (
              <>
                <button onClick={() => setLoginOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Login
                </button>
                <button onClick={() => setRegisterOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded">
                  Register
                </button>
              </>
            ) : (
              <div className="relative">
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                  <UserCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-999">
                    <button
                      onClick={() => {
                        setProfileModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 hover:bg-blue-100"
                    >
                      <UserCircleIcon className="w-5 h-5" /> View Profile
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600"
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* ================= MOBILE ICONS ================= */}
          <div className="md:hidden flex items-center gap-3 relative">
            {isAuthenticated && (
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <UserCircleIcon className="w-7 h-7 text-gray-700" />
              </button>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>

            {/* MOBILE PROFILE DROPDOWN */}
            {profileDropdownOpen && isAuthenticated && (
              <div className="absolute right-0 top-12 w-52 bg-white border rounded-xl shadow-xl z-999">
                <button
                  onClick={() => {
                    setProfileModalOpen(true);
                    setProfileDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 hover:bg-blue-100"
                >
                  <UserCircleIcon className="w-5 h-5" /> View Profile
                </button>

                <button
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-2">
            <button onClick={() => scrollToSection("home")} className={navClass("home") + " w-full text-left"}>
              Home
            </button>

            {isAuthenticated && (
              <>
                <button onClick={() => scrollToSection("book")} className={navClass("book") + " w-full text-left"}>
                  Book Room
                </button>
                <button onClick={() => scrollToSection("reservations")} className={navClass("reservations") + " w-full text-left"}>
                  My Reservations
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <button onClick={() => setLoginOpen(true)} className="w-full bg-blue-600 text-white py-2 rounded">
                  Login
                </button>
                <button onClick={() => setRegisterOpen(true)} className="w-full bg-green-600 text-white py-2 rounded">
                  Register
                </button>
              </>
            )}

            {isAuthenticated && (
              <button onClick={logout} className="w-full bg-red-600 text-white py-2  rounded">
                Logout
              </button>
            )}
          </div>
        )}
      </header>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-20">
        <div ref={homeRef}><Home /></div>
        {isAuthenticated && <div ref={bookRef}><BookRoom /></div>}
        {isAuthenticated && <div ref={reservationsRef}><MyReservations /></div>}
      </main>

      {/* ================= LOGIN MODAL ================= */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-8  px-5 rounded-xl w-[95vw] max-w-md relative animate-scaleIn">
            <button className="absolute top-3 right-3" onClick={() => setLoginOpen(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>

            <ClientLogin
              onSuccess={() => setLoginOpen(false)}
              onSwitchToRegister={() => {
                setLoginOpen(false);
                setRegisterOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* ================= REGISTER MODAL ================= */}
      {registerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl w-full max-w-md relative animate-scaleIn">
            <button className="absolute top-3 right-3" onClick={() => setRegisterOpen(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>

            <ClientRegister
              onSuccess={() => {
                setRegisterOpen(false);
                setLoginOpen(true); // successful registration → open login
              }}
              onSwitchToLogin={() => {
                setRegisterOpen(false);
                setLoginOpen(true); // manual switch
              }}
            />
          </div>
        </div>
      )}

      {/* ================= PROFILE MODAL ================= */}
      {profileModalOpen && guest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-scaleIn">

            <button
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setProfileModalOpen(false)}
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>

            <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
              <UserCircleIcon className="w-20 h-20 mx-auto mb-2 bg-white text-blue-600 rounded-full p-1" />
              <h2 className="text-xl font-bold">{guest.fullName}</h2>
              <p className="text-sm opacity-80">{guest.email}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                <span className="text-sm text-gray-500">📞 Phone</span>
                <span className="font-medium">{guest.phoneNumber}</span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                <span className="text-sm text-gray-500">🆔 Guest ID</span>
                <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                  {guest._id}
                </span>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
