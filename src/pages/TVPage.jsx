// src/pages/TVPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function TVPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [seasonNum, setSeasonNum] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [episodeNum, setEpisodeNum] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_KEY}&language=en-US`);
      const data = await res.json();
      setShow(data);

      const s = (data.seasons || []).find((x) => x.season_number > 0) ?? { season_number: 1 };
      setSeasonNum(s.season_number);

      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!seasonNum) return;
    (async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNum}?api_key=${TMDB_KEY}&language=en-US`
      );
      const data = await res.json();
      const eps = (data.episodes || []).filter((e) => e.episode_number > 0);
      setEpisodes(eps);
      setEpisodeNum(eps[0]?.episode_number || 1);
    })();
  }, [id, seasonNum]);

  const seasons = useMemo(
    () => (show?.seasons || []).filter((s) => s.season_number > 0),
    [show]
  );

  const playerSrc = `https://vidlink.pro/tv/${id}/${seasonNum}/${episodeNum}`;

  if (loading || !show) {
    return <div className="text-center mt-20 text-gray-400 text-lg">Loading…</div>;
  }

  const goPrev = () => {
    const idx = episodes.findIndex((e) => e.episode_number === episodeNum);
    if (idx > 0) setEpisodeNum(episodes[idx - 1].episode_number);
  };

  const goNext = () => {
    const idx = episodes.findIndex((e) => e.episode_number === episodeNum);
    if (idx < episodes.length - 1) setEpisodeNum(episodes[idx + 1].episode_number);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
          {show.name}
        </h1>
        <p className="text-gray-300 text-sm md:text-base max-w-3xl mb-6">
          {show.overview}
        </p>

        {/* Season + Episode Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Season</label>
            <select
              className="bg-gray-800 px-3 py-2 rounded-md text-white"
              value={seasonNum}
              onChange={(e) => setSeasonNum(Number(e.target.value))}
            >
              {seasons.map((s) => (
                <option key={s.id ?? s.season_number} value={s.season_number}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-1">Episode</label>
            <select
              className="bg-gray-800 px-3 py-2 rounded-md text-white"
              value={episodeNum}
              onChange={(e) => setEpisodeNum(Number(e.target.value))}
            >
              {episodes.map((e) => (
                <option key={e.id ?? e.episode_number} value={e.episode_number}>
                  {e.episode_number}. {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={goPrev}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition"
            >
              ⟨ Prev
            </button>
            <button
              onClick={goNext}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition"
            >
              Next ⟩
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl border border-gray-800">
          <iframe
            src={playerSrc}
            allowFullScreen
            frameBorder="0"
            className="w-full h-full"
            title={`${show.name} S${seasonNum}E${episodeNum}`}
          />
        </div>
      </div>
    </div>
  );
}
