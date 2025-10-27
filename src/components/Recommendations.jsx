// src/components/Recommendations.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import MovieRow from "./MovieRow";
import { useAuth } from "../context/AuthContext";

export default function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;

      // Fetch user’s watch history from Firestore
      const watchRef = collection(db, "users", user.uid, "watched");
      const snapshot = await getDocs(watchRef);
      const watched = snapshot.docs.map((doc) => doc.data());

      if (watched.length === 0) return;

      // Pick genres of watched movies
      const genreIds = watched
        .flatMap((m) => m.genre_ids || [])
        .filter((v, i, a) => a.indexOf(v) === i);

      // Fetch recommended movies
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${genreIds
          .slice(0, 3)
          .join(",")}`
      );
      const data = await res.json();
      setRecommendations(data.results);
    };

    fetchRecommendations();
  }, [user]);

  return recommendations.length > 0 ? (
    <MovieRow title="Recommended For You" customList={recommendations} />
  ) : null;
}
