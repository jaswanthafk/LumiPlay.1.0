// src/pages/TVPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function TVPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [playerSrc, setPlayerSrc] = useState("");
  const [isVidLink, setIsVidLink] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const pageRef = useRef(null);

  // Fetch TV show details
  useEffect(() => {
    async function fetchShow() {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_KEY}&language=en-US`
      );
      const data = await res.json();
      setShow(data);
    }
    fetchShow();
  }, [id]);

  // GSAP entrance animation
  useEffect(() => {
    if (pageRef.current)
      gsap.fromTo(pageRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 });
  }, [show]);

  // Setup main player (VidLink) and fallback (VidKing)
  useEffect(() => {
    if (!show) return;

    const vidLinkURL = `https://vidlink.pro/tv/${show.id}/1/1`;
    const vidKingURL = `https://www.vidking.net/embed/tv/${show.id}/1/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`;

    setPlayerSrc(vidLinkURL);
    setIsVidLink(true);
    setLoadingError(false);

    const timeout = setTimeout(() => {
      if (!loadingError && isVidLink) {
        setPlayerSrc(vidKingURL);
        setIsVidLink(false);
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [show]);

  // Manual player switch
  const handlePlayerSwitch = () => {
    if (!show) return;
    if (isVidLink) {
      setPlayerSrc(`https://www.vidking.net/embed/tv/${show.id}/1/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`);
      setIsVidLink(false);
    } else {
      setPlayerSrc(`https://vidlink.pro/tv/${show.id}/1/1`);
      setIsVidLink(true);
    }
  };

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  if (!show) return <div className="text-center mt-20 text-gray-400">Loading...</div>;

  return (
    <div ref={pageRef} className="relative bg-black text-white min-h-screen flex flex-col items-center mt-20">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold z-20 transition"
      >
        ← Back
      </button>

      {/* Player */}
      <div className="relative w-full max-w-7xl aspect-video mt-20 rounded-lg overflow-hidden shadow-2xl">
        <iframe
          src={playerSrc}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          title={show.name}
          className="w-full h-full"
          onError={() => {
            if (isVidLink) {
              setPlayerSrc(`https://www.vidking.net/embed/tv/${show.id}/1/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`);
              setIsVidLink(false);
              setLoadingError(true);
            }
          }}
        ></iframe>

        {/* Overlay when paused */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center px-6">
            <img
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              className="w-48 mb-4 rounded-lg shadow-lg"
            />
            <h1 className="text-3xl font-bold mb-2">{show.name}</h1>
            <p className="max-w-xl text-gray-300 mb-4">{show.overview}</p>
            <button
              onClick={handlePauseToggle}
              className="bg-blue-600 px-5 py-2 rounded font-semibold hover:bg-blue-500 transition"
            >
              ▶ Resume
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-6 mb-8">
        <button
          onClick={handlePauseToggle}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm font-semibold transition"
        >
          {isPaused ? "▶ Resume" : "❚❚ Pause"}
        </button>

        <button
          onClick={handlePlayerSwitch}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-semibold transition"
        >
          Switch to {isVidLink ? "VidKing" : "VidLink"}
        </button>
      </div>
    </div>
  );
}
