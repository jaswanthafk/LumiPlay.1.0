import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "../utils/watchlist";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (user) {
      const exists = isInWatchlist(user, movie.id);
      setInWatchlist(exists);
    }
  }, [user, movie.id]);

  const imageUrl =
    movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.poster
      ? `https://image.tmdb.org/t/p/w500${movie.poster}`
      : "https://via.placeholder.com/300x450?text=No+Image";

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (!user) return alert("Please log in to use your Watchlist.");

    if (inWatchlist) {
      removeFromWatchlist(user, movie.id);
      setInWatchlist(false);
    } else {
      addToWatchlist(user, movie);
      setInWatchlist(true);
    }
  };

  return (
    <div
      className="group relative cursor-pointer transition-all duration-500 hover:scale-[1.07] hover:z-20"
      style={{ width: "200px" }}
      onClick={() => navigate(`/movies/${movie.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <img
          src={imageUrl}
          alt={movie.title || movie.name}
          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Glass Gradient Overlay */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        ></div>

        {/* ❤️ Watchlist Button */}
        <button
          onClick={handleWatchlist}
          className="absolute top-3 right-3 z-20 bg-black/60 p-2 rounded-full text-white hover:text-red-500 hover:bg-black/80 transition-all"
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {inWatchlist ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
        </button>

        {/* Movie Info */}
        <div
          className={`absolute bottom-0 left-0 w-full p-4 text-left rounded-b-2xl transition-all duration-500 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {movie.title || movie.name}
          </h3>
          {movie.overview && (
            <p className="text-gray-300 text-xs line-clamp-3">
              {movie.overview}
            </p>
          )}
          {movie.vote_average && (
            <span className="text-xs mt-1 block text-blue-400">
              ⭐ {(movie.vote_average || 0).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
