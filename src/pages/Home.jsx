// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MovieRow from "../components/MovieRow";
import Recommendations from "../components/Recommendations";
import { fetchWithCache } from "../utils/fetchWithCache";
import { getWatchlist } from "../utils/watchlist";
import { FiPlay, FiPause, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import './Home.css'
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function Home() {
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [previousWatches, setPreviousWatches] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const heroRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch hero movies (popular)
  useEffect(() => {
    async function fetchHeroMovies() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`
      );
      const data = await res.json();
      setHeroMovies(data.results || []);
    }
    fetchHeroMovies();
  }, []);

  // Auto-slide hero
  useEffect(() => {
    if (heroMovies.length === 0) return;
    intervalRef.current = setInterval(() => nextHero(), 7000);
    return () => clearInterval(intervalRef.current);
  }, [heroMovies, currentHero]);

  const animateHero = (index, direction) => {
    const el = heroRef.current;
    if (!el) return;
    const fromX = direction === "left" ? 150 : -150;
    gsap.fromTo(
      el,
      { x: fromX, opacity: 0.85 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  };

  const nextHero = () => {
    if (heroMovies.length === 0) return;
    const nextIndex = (currentHero + 1) % heroMovies.length;
    animateHero(nextIndex, "left");
    setCurrentHero(nextIndex);
  };

  const prevHero = () => {
    if (heroMovies.length === 0) return;
    const prevIndex = (currentHero - 1 + heroMovies.length) % heroMovies.length;
    animateHero(prevIndex, "right");
    setCurrentHero(prevIndex);
  };

  const pauseHero = () => {
    clearInterval(intervalRef.current);
  };

  const currentMovie = heroMovies[currentHero];

  // Load previous watches from localStorage
  useEffect(() => {
    if (!user) return;
    const data = JSON.parse(localStorage.getItem(`history_${user.uid}`)) || [];
    setPreviousWatches(data);
  }, [user]);

  // Load watchlist
  useEffect(() => {
    if (user) {
      const list = getWatchlist(user);
      setWatchlist(list);
    }
  }, [user]);

  // (Optional) Simple, genre-based recommendations are in <Recommendations />

  return (
    <div className="min-h-screen text-white bg-black overflow-hidden">
      {/* HERO */}
      {currentMovie && (
        <section className="relative flex flex-col justify-end items-center mt-20 md:mt-24 h-[65vh] sm:h-[70vh]">
          <div className="relative w-[92%] sm:w-[86%] md:w-[82%] h-full rounded-3xl overflow-hidden shadow-2xl">
            {/* Backdrop */}
            <div
              ref={heroRef}
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

            {/* Text + Buttons */}
            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-auto max-w-2xl z-10">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-xl leading-tight">
                {currentMovie.title}
              </h1>
              <p className="text-gray-200 mb-4 sm:mb-6 text-sm sm:text-base line-clamp-3">
                {currentMovie.overview}
              </p>

              {/* Buttons: stack on mobile, row on >= sm */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-full sm:max-w-none">
                <button
                  onClick={() => navigate(`/movies/${currentMovie.id}`)}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600/85 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-blue-500/90 transition-all shadow-lg w-full sm:w-auto"
                >
                  <FiPlay className="text-base sm:text-lg" />
                  <span>Play</span>
                </button>

                <button
                  onClick={pauseHero}
                  id="pausebtn"
                  className="inline-flex items-center justify-center gap-2 bg-gray-700/65 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-gray-600/70 transition-all shadow-md w-full sm:w-auto"
                >
                  <FiPause className="text-base sm:text-lg" />
                  <span>Pause</span>
                </button>
              </div>
            </div>
          </div>

          {/* Arrows – separated from buttons area, never overlap */}
          <div className="absolute bottom-4 sm:bottom-6 flex gap-3 sm:gap-4 z-10">
            <button
              onClick={prevHero}
              className="p-2.5 sm:p-3 bg-gray-800/70 backdrop-blur-md rounded-full hover:bg-gray-700/80 transition-all shadow-lg"
              aria-label="Previous"
            >
              <FiChevronLeft size={18} className="sm:size-5" />
            </button>
            <button
              onClick={nextHero}
              className="p-2.5 sm:p-3 bg-gray-800/70 backdrop-blur-md rounded-full hover:bg-gray-700/80 transition-all shadow-lg"
              aria-label="Next"
            >
              <FiChevronRight size={18} className="sm:size-5" />
            </button>
          </div>
        </section>
      )}

      {/* WATCHLIST */}
      {user && watchlist.length > 0 && (
        <div className="mt-8 sm:mt-10">
          <MovieRow title="Your Watchlist ❤️" customList={watchlist} />
        </div>
      )}

      {/* PREVIOUS WATCHES */}
      {user && previousWatches.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <MovieRow title="Your Previous Watches" customList={previousWatches} />
        </div>
      )}

      {/* RECOMMENDATIONS (component handles its own fetching/caching) */}
      <Recommendations />

      {/* STANDARD TMDB ROWS */}
      <MovieRow title="Popular on LumiPlay" endpoint="/movie/popular" />
      <MovieRow title="Top Rated" endpoint="/movie/top_rated" />
      <MovieRow title="Upcoming" endpoint="/movie/upcoming" />
      <MovieRow title="Now Playing" endpoint="/movie/now_playing" />
      <MovieRow title="Trending" endpoint="/trending/movie/week" />
    </div>
  );
}
