"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import type { Video } from "@/src/types";

type VideoListParams = {
  channel?: number;
  ordering?: string;
  search?: string;
  typeSlugs?: string[];
  disciplineIds?: number[];
  tagSlugs?: string[];
  tagNames?: string[];
  themes?: number[];
  cursus?: string[];
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

  if (params?.typeSlugs?.length) {
    params.typeSlugs.forEach((typeSlug) => {
      url.searchParams.append("type__slug", typeSlug);
    });
  }

  if (params?.disciplineIds?.length) {
    params.disciplineIds.forEach((disciplineId) => {
      url.searchParams.append("discipline", String(disciplineId));
    });
  }

  if (params?.tagSlugs?.length) {
    params.tagSlugs.forEach((tagSlug) => {
      url.searchParams.append("tags__slug", tagSlug);
    });
  }

  if (params?.tagNames?.length) {
    params.tagNames.forEach((tagName) => {
      url.searchParams.append("tags__name", tagName);
    });
  }

  if (params?.themes?.length) {
    params.themes.forEach((themeId) => {
      url.searchParams.append("themes", String(themeId));
    });
  }

  if (params?.cursus?.length) {
    params.cursus.forEach((cursus) => {
      url.searchParams.append("cursus_slug", cursus);
    });
  }

  return url.toString();
};

const dedupeVideos = (videoLists: Video[][]): Video[] => {
  const videosById = new Map<number, Video>();

  videoLists.flat().forEach((video) => {
    videosById.set(video.id, video);
  });

  return Array.from(videosById.values());
};

const sortVideos = (videos: Video[], ordering?: string): Video[] => {
  const sortedVideos = [...videos];

  switch (ordering) {
    case "-created_at":
      return sortedVideos.sort(
        (firstVideo, secondVideo) =>
          new Date(secondVideo.created_at).getTime() -
          new Date(firstVideo.created_at).getTime(),
      );
    case "created_at":
      return sortedVideos.sort(
        (firstVideo, secondVideo) =>
          new Date(firstVideo.created_at).getTime() -
          new Date(secondVideo.created_at).getTime(),
      );
    case "-title":
      return sortedVideos.sort((firstVideo, secondVideo) =>
        secondVideo.title.localeCompare(firstVideo.title),
      );
    case "title":
      return sortedVideos.sort((firstVideo, secondVideo) =>
        firstVideo.title.localeCompare(secondVideo.title),
      );
    default:
      return videos;
  }
};

export function useVideos() {
  const { accessToken, refresh } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [useVideoLoading, setUseVideoLoading] = useState(false);
  const [useVideoError, setUseVideoError] = useState<string | null>(null);

  const fetchOne = useCallback(
    async (slug: string) => {
      setUseVideoLoading(true);
      setUseVideoError(null);

      try {
        const res = await authFetch(getRoutes().video.get(slug), {
          accessToken,
          onRefresh: refresh,
        });

        const data = await requestJson<Video>(res);
        setVideo(data);
        return data;
      } catch (e: unknown) {
        setUseVideoError(
          e instanceof Error ? e.message : "Erreur de chargement.",
        );
        return null;
      } finally {
        setUseVideoLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const fetchVideoList = useCallback(
    async (baseUrl: string, params?: VideoListParams) => {
      setUseVideoLoading(true);
      setUseVideoError(null);

      try {
        const typeSlugs = params?.typeSlugs ?? [];
        const urls =
          typeSlugs.length > 1
            ? typeSlugs.map((typeSlug) =>
                buildVideoListUrl(baseUrl, {
                  ...params,
                  typeSlugs: [typeSlug],
                }),
              )
            : [buildVideoListUrl(baseUrl, params)];

        const responses = await Promise.all(
          urls.map((url) =>
            authFetch(url, {
              accessToken,
              onRefresh: refresh,
            }),
          ),
        );
        const videoLists = await Promise.all(
          responses.map((response) => requestJson<Video[]>(response)),
        );
        const data = sortVideos(dedupeVideos(videoLists), params?.ordering);
        setVideos(data);
        return data;
      } catch (e: unknown) {
        setUseVideoError(
          e instanceof Error ? e.message : "Erreur de chargement.",
        );
        return [];
      } finally {
        setUseVideoLoading(false);
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
      setUseVideoLoading(true);
      setUseVideoError(null);

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
        setUseVideoError(
          e instanceof Error
            ? e.message
            : "Erreur lors de la suppression de la vidéo.",
        );
        return false;
      } finally {
        setUseVideoLoading(false);
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
