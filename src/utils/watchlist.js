// src/utils/watchlist.js
export const getWatchlist = (user) => {
  if (!user) return [];
  const stored = localStorage.getItem(`watchlist_${user.uid}`);
  return stored ? JSON.parse(stored) : [];
};

export const addToWatchlist = (user, movie) => {
  if (!user) return;
  const current = getWatchlist(user);
  const exists = current.find((m) => m.id === movie.id);
  if (exists) return;
  const updated = [...current, movie];
  localStorage.setItem(`watchlist_${user.uid}`, JSON.stringify(updated));
};

export const removeFromWatchlist = (user, movieId) => {
  if (!user) return;
  const current = getWatchlist(user);
  const updated = current.filter((m) => m.id !== movieId);
  localStorage.setItem(`watchlist_${user.uid}`, JSON.stringify(updated));
};

export const isInWatchlist = (user, movieId) => {
  if (!user) return false;
  const current = getWatchlist(user);
  return current.some((m) => m.id === movieId);
};
