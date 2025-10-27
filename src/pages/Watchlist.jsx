import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getWatchlist } from "../utils/watchlist";
import MovieRow from "../components/MovieRow";

export default function Watchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) setWatchlist(getWatchlist(user));
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-gray-400 mt-20">
        Please log in to view your Watchlist.
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-20">
        Your watchlist is empty 😕
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Watchlist ❤️</h1>
      <MovieRow title="Saved Movies" customList={watchlist} />
    </div>
  );
}
