// src/pages/Movies.jsx
import React, { useEffect, useRef } from "react";
import MovieRow from "../components/MovieRow";
import { gsap } from "gsap";

export default function Movies() {
  const pageRef = useRef();

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 });
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-black text-white">
      <div className="pt-24 px-6">
        <h1 className="text-4xl font-bold mb-8">Movies</h1>

        <MovieRow title="Popular Movies" endpoint="/movie/popular" />
        <MovieRow title="Top Rated Movies" endpoint="/movie/top_rated" />
        <MovieRow title="Upcoming Movies" endpoint="/movie/upcoming" />
        <MovieRow title="Now Playing" endpoint="/movie/now_playing" />
      </div>
    </div>
  );
}
