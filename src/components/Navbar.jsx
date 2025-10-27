// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  FaMoon,
  FaSun,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";

export default function Navbar({}) {
  const navRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-black/40 border-b border-gray-700/50 transition-all duration-500 `}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition text-white drop-shadow-[0_1px_5px_rgba(30,144,255,0.5)]"
        >
          <span className="text-[#3b82f6]">Lumi</span>Play
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { to: "/", label: "Home" },
            { to: "/movies", label: "Movies" },
            { to: "/tvshows", label: "TV Shows" },
            { to: "/watchlist", label: "Watchlist" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-medium tracking-wide transition-all hover:text-blue-400 ${
                location.pathname === link.to ||
                location.pathname.startsWith(link.to)
                  ? "text-blue-400"
                  : "text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <SearchBar />

          {/* User dropdown */}
          {user ? (
            <div className="relative ml-4">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none hover:opacity-90 transition"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-blue-500"
                  />
                ) : (
                  <FaUserCircle size={26} className="text-blue-400" />
                )}
                <span className="hidden sm:block font-semibold text-gray-200 drop-shadow-md">
                  Hi, {user.displayName || "User"}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl p-2 border border-gray-700/60 z-50">
                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaUserCircle /> Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 w-full rounded-lg hover:bg-gray-800 transition text-left"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-4 bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-2xl font-semibold text-white shadow-md transition-all"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-xl p-2 bg-gray-800/50 rounded-full backdrop-blur-md text-gray-200"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-md border-t border-gray-800 p-5 flex flex-col gap-4 text-sm font-medium text-gray-200">
          {["Movies", "TV Shows", "Watchlist"].map((label) => (
            <Link
              key={label}
              to={`/${label.toLowerCase().replace(" ", "")}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/account" onClick={() => setMenuOpen(false)}>
                Account
              </Link>
              <button onClick={handleLogout} className="text-left">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
