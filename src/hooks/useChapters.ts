"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import { requestJson } from "@/src/utils/requestJson";
import type { Chapter } from "@/src/types";
import { useTranslation } from "./useTranslation";

/** Provides chapter queries and mutations for a video. */
export const useChapters = (videoSlug?: string, videoId?: number) => {
  const { accessToken, refresh } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const authOpts = { accessToken, onRefresh: refresh };

  const {
    data: chapters,
    isLoading,
    error,
  } = useQuery<Chapter[]>({
    queryKey: ["chapters", videoSlug, videoId],
    queryFn: async () => {
      if (!videoSlug && !videoId) return [];
      const param = videoSlug ? `video_slug=${videoSlug}` : `video=${videoId}`;
      const res = await authFetch(
        `${getRoutes().chapters.list}?${param}`,
        authOpts,
      );
      if (!res.ok) {
        throw new Error(t("errors.loadChapters"));
      }
      const data = await requestJson<Chapter[] | { results: Chapter[] }>(res);
      return Array.isArray(data) ? data : data.results || [];
    },
    enabled: Boolean(videoSlug || videoId),
  });

  const createChapterMutation = useMutation({
    mutationFn: async (payload: {
      video: number;
      title: string;
      time_start: number;
    }) => {
      const res = await authFetch(getRoutes().chapters.list, {
        ...authOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(t("errors.addChapter"));
      }
      return requestJson<Chapter>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      queryClient.invalidateQueries({ queryKey: ["video"] });
    },
  });

  const deleteChapterMutation = useMutation({
    mutationFn: async (chapterId: number) => {
      const res = await authFetch(getRoutes().chapters.get(chapterId), {
        ...authOpts,
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(t("errors.deleteChapter"));
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      queryClient.invalidateQueries({ queryKey: ["video"] });
    },
  });

  return {
    chapters: chapters || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    createChapter: createChapterMutation.mutateAsync,
    deleteChapter: deleteChapterMutation.mutateAsync,
  };
};
