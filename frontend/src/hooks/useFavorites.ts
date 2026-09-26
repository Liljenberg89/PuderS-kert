import { useEffect, useState } from "react";

const STORAGE_KEY = "pudersakert:favorites";

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(readFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Private browsing / full storage quota — favorites just won't persist.
    }
  }, [favorites]);

  function toggleFavorite(resortId: string) {
    setFavorites((prev) =>
      prev.includes(resortId)
        ? prev.filter((id) => id !== resortId)
        : [...prev, resortId],
    );
  }

  function isFavorite(resortId: string) {
    return favorites.includes(resortId);
  }

  return { favorites, toggleFavorite, isFavorite };
}
