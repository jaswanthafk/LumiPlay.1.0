import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function SearchContainer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(
            query
          )}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data.results?.slice(0, 10) || []);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    };

    const delay = setTimeout(fetchResults, 400);
    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (item) => {
    if (item.media_type === "movie") navigate(`/movies/${item.id}`);
    else if (item.media_type === "tv") navigate(`/tv/${item.id}`);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Search bar */}
      <div className="w-full bg-gray-900/70 backdrop-blur-md rounded-full px-4 py-2 flex items-center shadow-lg">
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search for movies or TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent w-full outline-none text-white placeholder-gray-400"
        />
      </div>

      {/* Inline results list */}
      {results.length > 0 && (
        <div className="w-full bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-semibold mb-3">Search Results</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((r) => (
              <div
                key={r.id}
                onClick={() => handleSelect(r)}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={
                    r.poster_path
                      ? `https://image.tmdb.org/t/p/w300${r.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={r.title || r.name}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <p className="mt-2 text-sm font-medium truncate">
                  {r.title || r.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {r.media_type}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
