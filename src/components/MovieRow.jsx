import React, { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchWithCache } from "../utils/fetchWithCache";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function MovieRow({ title, endpoint, customList }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  const drag = useRef({ down: false, startX: 0, startLeft: 0 });

  useEffect(() => {
    async function loadMovies() {
      if (customList && customList.length > 0) {
        setMovies(customList);
        return;
      }

      if (!endpoint) return;
      const sep = endpoint.includes("?") ? "&" : "?";
      const url = `https://api.themoviedb.org/3${endpoint}${sep}api_key=${TMDB_KEY}&language=en-US&page=1`;
      const key = `movie_${endpoint.replace(/[/?&=]/g, "_")}`;
      const data = await fetchWithCache(key, url);
      setMovies(data.results || []);
    }
    loadMovies();
  }, [endpoint, customList]);

  const scrollByView = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollTo({
      left: el.scrollLeft + (dir === "left" ? -amount : amount),
      behavior: "smooth",
    });
  };

  // Convert wheel to horizontal scroll only
  const onWheel = (e) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollLeft += Math.abs(e.deltaY) > Math.abs(e.deltaX)
      ? e.deltaY
      : e.deltaX;
    e.preventDefault();
  };

  // Mouse drag scroll
  const onMouseDown = (e) => {
    const el = rowRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft };
    el.classList.add("dragging");
  };
  const onMouseUp = () => {
    const el = rowRef.current;
    drag.current.down = false;
    el && el.classList.remove("dragging");
  };
  const onMouseLeave = onMouseUp;
  const onMouseMove = (e) => {
    const el = rowRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    el.scrollLeft = drag.current.startLeft - dx;
  };

  // Touch drag scroll
  const touchStartX = useRef(0);
  const touchStartLeft = useRef(0);
  const onTouchStart = (e) => {
    const el = rowRef.current;
    if (!el) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartLeft.current = el.scrollLeft;
  };
  const onTouchMove = (e) => {
    const el = rowRef.current;
    if (!el) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    el.scrollLeft = touchStartLeft.current - dx;
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative mb-8 sm:mb-10 group">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 px-3 sm:px-4">
        {title}
      </h2>

      {/* Left Arrow (hidden on mobile) */}
      <button
        onClick={() => scrollByView("left")}
        className="absolute left-1 sm:left-2 top-1/2  -translate-y-1/2 z-10 hidden md:flex items-center justify-center bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
        aria-label="Scroll left"
      >
        <FaChevronLeft />
      </button>

      {/* Row */}
      <div
        ref={rowRef}
        className="flex gap-2 sm:gap-3 px-3 sm:px-4 pb-2 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {movies.map((m) => (
          <div
            key={m.id}
            className="shrink-0 snap-start"
          >
            <MovieCard movie={m} />
          </div>
        ))}
      </div>

      {/* Right Arrow (hidden on mobile) */}
      <button
        onClick={() => scrollByView("right")}
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
        aria-label="Scroll right"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
