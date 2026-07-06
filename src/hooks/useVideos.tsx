"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import type { Video } from "@/src/types";

type UnlockPayload = {
  password?: string;
  hash?: string;
};

type UnlockResponse = {
  video_url?: string;
  source?: string;
  error?: string;
};

export type VideoListParams = {
  channel?: number;
  ordering?: string;
  search?: string;
  page?: number;
  createdAtGte?: string;
  createdAtLte?: string;
  typeSlugs?: string[];
  disciplineIds?: number[];
  tagSlugs?: string[];
  tagNames?: string[];
  cursusSlugs?: string[];
  statuses?: string[];
  ownerUsernames?: string[];
};

const appendValues = (
  searchParams: URLSearchParams,
  name: string,
  values?: Array<string | number>,
) => {
  values
    ?.filter((value) => String(value).trim() !== "")
    .forEach((value) => searchParams.append(name, String(value)));
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

  if (params?.page != null) {
    url.searchParams.set("page", String(params.page));
  }

  if (params?.createdAtGte) {
    url.searchParams.set("created_at__gte", params.createdAtGte);
  }

  if (params?.createdAtLte) {
    url.searchParams.set("created_at__lte", params.createdAtLte);
  }

  appendValues(url.searchParams, "type__slug", params?.typeSlugs);
  appendValues(url.searchParams, "discipline", params?.disciplineIds);
  appendValues(url.searchParams, "tags__slug", params?.tagSlugs);
  appendValues(url.searchParams, "tags__name", params?.tagNames);
  appendValues(url.searchParams, "cursus__slug", params?.cursusSlugs);
  appendValues(url.searchParams, "status", params?.statuses);
  appendValues(url.searchParams, "owner__username", params?.ownerUsernames);

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

type VideoListResponse = Video[] | { results?: Video[] };

const normalizeVideoList = (data: VideoListResponse): Video[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.results)) {
    return data.results;
  }

  return [];
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

        if (res.status === 404 && !accessToken) {
          throw new Error("AUTH_REQUIRED");
        }

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
        const response = await authFetch(buildVideoListUrl(baseUrl, params), {
          accessToken,
          onRefresh: refresh,
        });

        const videoList = await requestJson<VideoListResponse>(response);
        const data = sortVideos(
          normalizeVideoList(videoList),
          params?.ordering,
        );

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

  const requestVideoList = useCallback(
    async (baseUrl: string, params?: VideoListParams) => {
      const response = await authFetch(buildVideoListUrl(baseUrl, params), {
        accessToken,
        onRefresh: refresh,
      });

      const videoList = await requestJson<VideoListResponse>(response);

      return sortVideos(normalizeVideoList(videoList), params?.ordering);
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

  const fetchVideoUserWithCoOwners = useCallback(
    async (userId?: number | null, params?: VideoListParams) => {
      setUseVideoLoading(true);
      setUseVideoError(null);

      try {
        const [ownedVideos, allVideos] = await Promise.all([
          requestVideoList(getRoutes().video.me, params),
          requestVideoList(getRoutes().video.list, params),
        ]);

        const coOwnedVideos =
          userId != null
            ? allVideos.filter((video) =>
                Boolean(video.co_owners?.includes(userId)),
              )
            : [];
        const mergedVideos = sortVideos(
          dedupeVideos([ownedVideos, coOwnedVideos]),
          params?.ordering,
        );

        setVideos(mergedVideos);
        return mergedVideos;
      } catch (e: unknown) {
        setUseVideoError(
          e instanceof Error ? e.message : "Erreur de chargement.",
        );
        return [];
      } finally {
        setUseVideoLoading(false);
      }
    },
    [requestVideoList],
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

  const unlockVideo = useCallback(
    async (slug: string, payload?: UnlockPayload) => {
      setUseVideoLoading(true);
      setUseVideoError(null);

      try {
        const hasPayload =
          payload != null && Object.values(payload).some((value) => value);
        const hasHash = Boolean(payload?.hash?.trim());
        const baseUnlockUrl = getRoutes().video.unlock(slug);
        const unlockUrl = hasHash
          ? `${baseUnlockUrl}?hash=${encodeURIComponent(payload?.hash ?? "")}`
          : baseUnlockUrl;
        const res = await authFetch(unlockUrl, {
          accessToken,
          onRefresh: refresh,
          method: hasPayload ? "POST" : "GET",
          headers: hasPayload
            ? {
                "Content-Type": "application/x-www-form-urlencoded",
              }
            : undefined,
          body: hasPayload
            ? new URLSearchParams({
                password: payload?.password?.trim() || "",
                hash: payload?.hash?.trim() || "",
              })
            : undefined,
        });

        const data = await requestJson<UnlockResponse>(res);
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.video_url) {
          setVideo((currentVideo) =>
            currentVideo
              ? {
                  ...currentVideo,
                  video_url: data.video_url ?? currentVideo.video_url,
                }
              : currentVideo,
          );
        }
        return data;
      } catch (e: unknown) {
        throw e instanceof Error ? e : new Error("Erreur de déverrouillage.");
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
    fetchVideoUserWithCoOwners,
    deleteVideo,
    unlockVideo,
  };
}
