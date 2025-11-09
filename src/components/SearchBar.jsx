// src/components/SearchBar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&language=en-US&include_adult=false&query=${encodeURIComponent(
            query
          )}`,
          { signal: controller.signal }
        );
        const data = await res.json();

        // Keep only movies & tv and sort by popularity
        const filtered = (data.results || [])
          .filter((item) => item.media_type === "movie" || item.media_type === "tv")
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 8);

        setSuggestions(filtered);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Search error:", err);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (item) => {
    setQuery("");
    setSuggestions([]);
    navigate(`/${item.media_type === "tv" ? "tv" : "movies"}/${item.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies or TV shows..."
          className="bg-gray-800 text-white px-3 py-1 rounded-md outline-none focus:ring-2 focus:ring-blue-600 w-44 sm:w-56"
        />
      </form>

      {/* Predictive suggestions */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-[#111] border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-800 transition"
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                    : "https://via.placeholder.com/92x138?text=No+Image"
                }
                className="w-10 h-14 object-cover rounded"
                alt=""
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {item.title || item.name}
                </span>
                <span className="text-xs text-gray-400">
                  {item.media_type === "movie" ? "Movie" : "TV Show"}{" "}
                  {item.release_date?.slice(0, 4) ||
                    item.first_air_date?.slice(0, 4) || ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
