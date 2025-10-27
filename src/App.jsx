import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MoviePage from "./pages/MoviePage.jsx";
import { useState } from "react";
import { useEffect } from "react";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import TVPage from "./pages/TVPage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AccountPage from "./pages/AccountPage";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Footer from "./components/Footer.jsx";
import AdWarning from "./components/AdWarning.jsx";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#000" : "#fff";
    document.body.style.color = darkMode ? "#fff" : "#000";
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <Navbar />
      <AdWarning />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/tvshows" element={<TVShows />} />
          <Route path="/tv/:id" element={<TVPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
      <Footer />
    </div>
  );
}
