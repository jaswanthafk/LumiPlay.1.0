import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "../context/AuthContext";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [playerSrc, setPlayerSrc] = useState("");
  const [isVidLink, setIsVidLink] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const pageRef = useRef(null);

  const { user } = useAuth();

  // Save watch history
  useEffect(() => {
    if (!user || !movie) return;
    const key = `history_${user.uid}`;
    let history = JSON.parse(localStorage.getItem(key)) || [];

    if (!history.find((h) => h.id === movie.id)) {
      history.unshift({
        id: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path,
        overview: movie.overview,
        genre_ids: movie.genre_ids,
        watchedAt: new Date().toISOString(),
      });
      if (history.length > 20) history.pop();
      localStorage.setItem(key, JSON.stringify(history));
    }
  }, [user, movie]);

  // Load movie info
  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US`
      );
      const data = await res.json();
      setMovie(data);
    }
    fetchMovie();
  }, [id]);

  // GSAP fade-in
  useEffect(() => {
    if (pageRef.current)
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
  }, [movie]);

  // Player logic
  useEffect(() => {
    if (!movie) return;
    const vidLinkURL = `https://vidlink.pro/movie/${movie.id}`;
    const vidKingURL = `https://www.vidking.net/embed/movie/${movie.id}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`;

    setPlayerSrc(vidLinkURL);
    setIsVidLink(true);
    setLoadingError(false);

    const timeout = setTimeout(() => {
      if (!loadingError && isVidLink) {
        setPlayerSrc(vidKingURL);
        setIsVidLink(false);
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [movie]);

  const handlePlayerSwitch = () => {
    if (!movie) return;
    if (isVidLink) {
      setPlayerSrc(
        `https://www.vidking.net/embed/movie/${movie.id}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
      );
      setIsVidLink(false);
    } else {
      setPlayerSrc(`https://vidlink.pro/movie/${movie.id}`);
      setIsVidLink(true);
    }
  };

  const handlePauseToggle = () => setIsPaused((p) => !p);

  if (!movie)
    return (
      <div className="text-center mt-24 text-gray-400 text-sm sm:text-base">
        Loading...
      </div>
    );

  return (
    <div
      ref={pageRef}
      className="relative bg-black text-white min-h-screen flex flex-col items-center px-3 sm:px-6  mt-20"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold z-30 text-xs sm:text-sm transition-all"
      >
        ← Back
      </button>

      {/* Video Container */}
      <div className="relative w-full max-w-5xl md:max-w-6xl aspect-video mt-16 sm:mt-20 rounded-xl overflow-hidden shadow-2xl">
        <iframe
          src={playerSrc}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          title={movie.title}
          className="w-full h-full"
          onError={() => {
            if (isVidLink) {
              setPlayerSrc(
                `https://www.vidking.net/embed/movie/${movie.id}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
              );
              setIsVidLink(false);
              setLoadingError(true);
            }
          }}
        ></iframe>

        {/* Paused Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center px-4 sm:px-6">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-32 sm:w-48 mb-4 rounded-lg shadow-lg"
            />
            <h1 className="text-xl sm:text-3xl font-bold mb-2">
              {movie.title}
            </h1>
            <p className="max-w-md sm:max-w-xl text-gray-300 text-xs sm:text-sm mb-4 line-clamp-4">
              {movie.overview}
            </p>
            <button
              onClick={handlePauseToggle}
              className="bg-blue-600 px-4 sm:px-5 py-2 rounded font-semibold hover:bg-blue-500 text-sm sm:text-base transition"
            >
              ▶ Resume
            </button>
          </div>
        )}
      </div>

      {/* Controls under player */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 mb-10">
        <button
          onClick={handlePauseToggle}
          className="bg-gray-800 hover:bg-gray-700 px-4 sm:px-5 py-2 rounded text-xs sm:text-sm font-semibold transition"
        >
          {isPaused ? "▶ Resume" : "❚❚ Pause"}
        </button>

        <button
          onClick={handlePlayerSwitch}
          className="bg-blue-600 hover:bg-blue-500 px-4 sm:px-5 py-2 rounded text-xs sm:text-sm font-semibold transition"
        >
          Switch to {isVidLink ? "VidKing" : "VidLink"}
        </button>
      </div>
    </div>
  );
}
