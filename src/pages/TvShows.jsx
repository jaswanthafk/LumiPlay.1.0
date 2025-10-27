import React, { useEffect, useRef, useState } from "react";
import TVRow from "../components/TVRow";
import { gsap } from "gsap";
import { useAuth } from "../context/AuthContext";
import { getWatchlist } from "../utils/watchlist";

export default function TVShows() {
  const pageRef = useRef();
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  // Load user’s watchlist
  useEffect(() => {
    if (user) {
      const list = getWatchlist(user);
      setWatchlist(list);
    }
  }, [user]);

  return (
    <div ref={pageRef} className="min-h-screen bg-black text-white overflow-hidden">
      <div className="pt-20 sm:pt-24 px-4 sm:px-6">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
          TV Shows
        </h1>

        {/* User Watchlist Section */}
        {user && watchlist.length > 0 && (
          <div className="mb-10">
            <TVRow title="Your Watchlist ❤️" customList={watchlist} />
          </div>
        )}

        {/* TV Categories */}
        <TVRow title="Popular TV Shows" endpoint="/tv/popular" />
        <TVRow title="Top Rated TV Shows" endpoint="/tv/top_rated" />
        <TVRow title="Currently Airing" endpoint="/tv/on_the_air" />
        <TVRow title="Airing Today" endpoint="/tv/airing_today" />

        {/* Fallback Message */}
        {user && watchlist.length === 0 && (
          <p className="text-gray-400 text-sm sm:text-base mt-6 text-center">
            Add some shows to your Watchlist to see them here ❤️
          </p>
        )}
      </div>
    </div>
  );
}
