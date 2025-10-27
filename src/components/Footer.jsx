import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaYoutube, FaArrowUp } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();
  const [showScroll, setShowScroll] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll smoothly to top
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-0 border-t border-gray-800 bg-gradient-to-t from-black via-black/95 to-gray-900/90 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            <span className="text-blue-500">Lumi</span>Play
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-sm">
            Discover. Watch. Enjoy. Your movies, your way.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          {[
            { name: "Home", to: "/" },
            { name: "Movies", to: "/movies" },
            { name: "TV Shows", to: "/tv" },
            { name: "Watchlist", to: "/watchlist" },
            { name: "Account", to: "/account" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="relative text-gray-400 hover:text-blue-400 transition duration-300 group"
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 text-2xl">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition-transform duration-300 hover:scale-110"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-transform duration-300 hover:scale-110"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-transform duration-300 hover:scale-110"
          >
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-110"
          title="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gray-500 py-5 border-t border-gray-800">
        © {year} <span className="text-blue-400 font-semibold">LumiPlay</span>.
        All rights reserved.
      </div>
    </footer>
  );
}
