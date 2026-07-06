"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { Favorite } from "@/src/types";

export function useFavorites() {
  const { accessToken, refresh } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [useFavoritesLoading, setUseFavoritesLoading] = useState(false);
  const [useFavoritesError, setUseFavoritesError] = useState<string | null>(
    null,
  );

  const fetchAll = useCallback(async () => {
    setUseFavoritesLoading(true);
    setUseFavoritesError(null);

    try {
      const res = await authFetch(getRoutes().favorite.list, {
        accessToken,
        onRefresh: refresh,
      });

      const data = await requestJson<Favorite[] | { results?: Favorite[] }>(
        res,
      );

      let items: Favorite[];
      if (Array.isArray(data)) {
        items = data;
      } else if (Array.isArray(data.results)) {
        items = data.results;
      } else {
        items = [];
      }

      setFavorites(items);
      return items;
    } catch (e: unknown) {
      setUseFavoritesError(
        e instanceof Error ? e.message : "Erreur de chargement des favoris.",
      );
      setFavorites([]);
      return [];
    } finally {
      setUseFavoritesLoading(false);
    }
  }, [accessToken, refresh]);

  const addFavorite = useCallback(
    async (videoId: number) => {
      setUseFavoritesLoading(true);
      setUseFavoritesError(null);

      try {
        const res = await authFetch(getRoutes().favorite.add, {
          accessToken,
          onRefresh: refresh,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ video: videoId }),
        });

        const data = await requestJson<Favorite>(res);

        setFavorites((prev) => [data, ...prev]);

        return data;
      } catch (e: unknown) {
        setUseFavoritesError(
          e instanceof Error
            ? e.message
            : "Erreur lors de l'ajout de la vidéo aux favoris.",
        );
        return null;
      } finally {
        setUseFavoritesLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const deleteFavoriteById = useCallback(
    async (favoriteId: number) => {
      setUseFavoritesLoading(true);
      setUseFavoritesError(null);

      try {
        const res = await authFetch(getRoutes().favorite.delete(favoriteId), {
          accessToken,
          onRefresh: refresh,
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(
            "Erreur lors de la suppression de la vidéo des favoris.",
          );
        }

        setFavorites((prev) =>
          prev.filter((favorite) => favorite.id !== favoriteId),
        );
        return true;
      } catch (e: unknown) {
        setUseFavoritesError(
          e instanceof Error
            ? e.message
            : "Erreur lors de la suppression de la vidéo des favoris.",
        );
        return false;
      } finally {
        setUseFavoritesLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const findFavoriteForVideo = useCallback(
    (videoId: number) => {
      return favorites.find((favorite) => favorite.video === videoId) ?? null;
    },
    [favorites],
  );

  const removeFavoriteForVideo = useCallback(
    async (videoId: number) => {
      const favorite = findFavoriteForVideo(videoId);
      if (!favorite) {
        return false;
      }
      return deleteFavoriteById(favorite.id);
    },
    [findFavoriteForVideo, deleteFavoriteById],
  );

  const isFavorite = useCallback(
    (videoId: number | undefined | null) => {
      if (videoId == null) {
        return false;
      }
      return favorites.some((favorite) => favorite.video === videoId);
    },
    [favorites],
  );

  return {
    favorites,
    useFavoritesLoading,
    useFavoritesError,
    fetchAll,
    addFavorite,
    deleteFavoriteById,
    removeFavoriteForVideo,
    isFavorite,
  };
}
