// src/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1&include_adult=false`
      );
      const data = await res.json();
      const filtered = (data.results || []).filter(
        (item) => item.media_type !== "person"
      );
      setResults(filtered);
    };
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6">Search Results for “{query}”</h1>
      {results.length === 0 ? (
        <p className="text-gray-400">No results found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                navigate(`/${item.media_type === "tv" ? "tv" : "movies"}/${item.id}`)
              }
              className="cursor-pointer"
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={item.title || item.name}
                className="rounded-lg hover:scale-105 transition-transform duration-300"
              />
              <h3 className="text-sm mt-2 text-center line-clamp-1">
                {item.title || item.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
