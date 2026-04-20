"use client";
import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import type { Video } from "@/src/types/interface";

export function useVideos() {
  const { accessToken, refresh } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(
    async (slug: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await authFetch(getRoutes().video.get(slug), {
          accessToken,
          onRefresh: refresh,
        });
        const data = await requestJson<Video>(res);
        setVideo(data);
        return data;
      } catch (e: any) {
        setError(e?.message ?? "Erreur de chargement.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(getRoutes().video.list, {
        accessToken,
        onRefresh: refresh,
      });
      const data = await requestJson<Video[]>(res);
      setVideos(data);
      return data;
    } catch (e: any) {
      setError(e?.message ?? "Erreur de chargement.");
      return [];
    } finally {
      setLoading(false);
    }
  }, [accessToken, refresh]);

  return { video, videos, loading, error, fetchOne, fetchAll };
}
