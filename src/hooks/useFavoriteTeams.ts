import { useState, useCallback } from "react";

const STORAGE_KEY = "statEdge_favoriteTeams";

function getStored(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useFavoriteTeams() {
  const [favorites, setFavorites] = useState<string[]>(getStored);

  const toggle = useCallback((teamId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (teamId: string) => favorites.includes(teamId),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
