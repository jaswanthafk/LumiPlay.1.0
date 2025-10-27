import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchWithCache } from "../utils/fetchWithCache";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function TVRow({ title, endpoint }) {
  const [shows, setShows] = useState([]);
  const rowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadShows() {
      const sep = endpoint.includes("?") ? "&" : "?";
      const url = `https://api.themoviedb.org/3${endpoint}${sep}api_key=${TMDB_KEY}&language=en-US&page=1`;
      const key = `tv_${endpoint.replace(/[/?&=]/g, "_")}`;
      const data = await fetchWithCache(key, url);
      setShows(data.results || []);
    }
    loadShows();
  }, [endpoint]);

  const scrollByView = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollTo({ left: el.scrollLeft + (dir === "left" ? -amount : amount), behavior: "smooth" });
  };

  const onWheel = (e) => {
    const el = rowRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  const onMouseDown = (e) => {
    const el = rowRef.current;
    if (!el) return;
    isDown.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };
  const onMouseLeave = () => (isDown.current = false);
  const onMouseUp = () => (isDown.current = false);
  const onMouseMove = (e) => {
    const el = rowRef.current;
    if (!el || !isDown.current) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1;
    el.scrollLeft = scrollLeft.current - walk;
  };

  const onTouchStart = (e) => {
    const el = rowRef.current;
    if (!el) return;
    startX.current = e.touches[0].clientX;
    scrollLeft.current = el.scrollLeft;
  };
  const onTouchMove = (e) => {
    const el = rowRef.current;
    if (!el) return;
    const dx = e.touches[0].clientX - startX.current;
    el.scrollLeft = scrollLeft.current - dx;
  };

  return (
    <div className="relative mb-10 group">
      <h2 className="text-2xl font-semibold mb-3 px-4">{title}</h2>

      <button
        onClick={() => scrollByView("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
        aria-label="Scroll left"
      >
        <FaChevronLeft />
      </button>

<div
  ref={rowRef}
  className="flex gap-3 overflow-x-auto overflow-y-hidden px-4 pb-2 scroll-smooth no-vertical-scroll"
  style={{
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
  }}
  onWheel={onWheel}
  onMouseDown={onMouseDown}
  onMouseLeave={onMouseLeave}
  onMouseUp={onMouseUp}
  onMouseMove={onMouseMove}
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
>

        {shows.map((show) => (
          <div
            key={show.id}
            style={{ scrollSnapAlign: "start" }}
            className="shrink-0 min-w-[160px] cursor-pointer relative group"
            onClick={() => navigate(`/tv/${show.id}`)}
          >
            <img
              src={
                show.poster_path
                  ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={show.name}
              className="rounded-lg w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
              <h3 className="text-base font-semibold">{show.name}</h3>
              <p className="text-xs text-gray-300">
                {show.first_air_date?.slice(0, 4) || "N/A"} • {(show.vote_average || 0).toFixed(1)} ★
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollByView("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
        aria-label="Scroll right"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
