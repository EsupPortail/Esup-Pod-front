"use client";
import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import type { Video } from "@/src/types/interface";

type FetchVideoUserParams = {
  ordering?: string;
  search?: string;
};

export function useVideos() {
  const { accessToken, refresh } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [useVideoLoading, useVideoSetLoading] = useState(false);
  const [useVideoError, useVideoSetError] = useState<string | null>(null);

  const fetchOne = useCallback(
    async (slug: string) => {
      useVideoSetLoading(true);
      useVideoSetError(null);
      try {
        const res = await authFetch(getRoutes().video.get(slug), {
          accessToken,
          onRefresh: refresh,
        });
        const data = await requestJson<Video>(res);
        setVideo(data);
        return data;
      } catch (e: unknown) {
        useVideoSetError(
          e instanceof Error ? e.message : "Erreur de chargement.",
        );
        return null;
      } finally {
        useVideoSetLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const fetchAll = useCallback(async () => {
    useVideoSetLoading(true);
    useVideoSetError(null);
    try {
      const res = await authFetch(getRoutes().video.list, {
        accessToken,
        onRefresh: refresh,
      });
      const data = await requestJson<Video[]>(res);
      setVideos(data);
      return data;
    } catch (e: unknown) {
      useVideoSetError(
        e instanceof Error ? e.message : "Erreur de chargement.",
      );
      return [];
    } finally {
      useVideoSetLoading(false);
    }
  }, [accessToken, refresh]);

  const fetchVideoUser = useCallback(
    async (params?: FetchVideoUserParams) => {
      useVideoSetLoading(true);
      useVideoSetError(null);
      try {
        const url = new URL(getRoutes().video.me);
        if (params?.ordering) {
          url.searchParams.set("ordering", params.ordering);
        }
        if (params?.search) {
          url.searchParams.set("search", params.search);
        }

        const res = await authFetch(url.toString(), {
          accessToken,
          onRefresh: refresh,
        });
        const data = await requestJson<Video[]>(res);
        setVideos(data);
        return data;
      } catch (e: unknown) {
        useVideoSetError(
          e instanceof Error ? e.message : "Erreur de chargement.",
        );
        return [];
      } finally {
        useVideoSetLoading(false);
      }
    },
    [accessToken, refresh],
  );

  return {
    video,
    videos,
    useVideoLoading,
    useVideoError,
    fetchOne,
    fetchAll,
    fetchVideoUser,
  };
}
