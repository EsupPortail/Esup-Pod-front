"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import type { Video } from "@/src/types/interface";

type VideoListParams = {
  channel?: number;
  ordering?: string;
  search?: string;
  themes?: number[];
};

const buildVideoListUrl = (
  baseUrl: string,
  params?: VideoListParams,
): string => {
  const url = new URL(baseUrl);

  if (params?.channel != null) {
    url.searchParams.set("channel", String(params.channel));
  }

  if (params?.ordering) {
    url.searchParams.set("ordering", params.ordering);
  }

  if (params?.search) {
    url.searchParams.set("search", params.search);
  }

  if (params?.themes?.length) {
    params.themes.forEach((themeId) => {
      url.searchParams.append("themes", String(themeId));
    });
  }

  return url.toString();
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

  const fetchVideoList = useCallback(
    async (baseUrl: string, params?: VideoListParams) => {
      useVideoSetLoading(true);
      useVideoSetError(null);

      try {
        const res = await authFetch(buildVideoListUrl(baseUrl, params), {
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

  const fetchAll = useCallback(
    async (params?: VideoListParams) => {
      return fetchVideoList(getRoutes().video.list, params);
    },
    [fetchVideoList],
  );

  const fetchVideoUser = useCallback(
    async (params?: VideoListParams) => {
      return fetchVideoList(getRoutes().video.me, params);
    },
    [fetchVideoList],
  );

  const deleteVideo = useCallback(
    async (slug: string) => {
      useVideoSetLoading(true);
      useVideoSetError(null);

      try {
        const res = await authFetch(getRoutes().video.delete(slug), {
          accessToken,
          onRefresh: refresh,
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Erreur lors de la suppression de la vidéo.");
        }

        setVideos((prevVideos) =>
          prevVideos.filter((item) => item.slug !== slug),
        );
        return true;
      } catch (e: unknown) {
        useVideoSetError(
          e instanceof Error
            ? e.message
            : "Erreur lors de la suppression de la vidéo.",
        );
        return false;
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
    deleteVideo,
  };
}
