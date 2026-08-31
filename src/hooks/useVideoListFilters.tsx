"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useDiscipline } from "@/src/hooks/useDiscipline";
import { useTags } from "@/src/hooks/useTags";
import { useTypes } from "@/src/hooks/useTypes";
import { useUsers } from "@/src/hooks/useUsers";
import { useVideosList, type VideoListParams } from "@/src/hooks/useVideos";
import {
  INITIAL_VIDEO_FILTERS,
  type VideoFiltersValue,
} from "@/src/components/video/filters/VideoFilters";

type UseVideoListFiltersOptions = {
  mode: "all" | "dashboard";
  enabled?: boolean;
  initialFilters?: Partial<VideoFiltersValue>;
};

export function useVideoListFilters({
  mode,
  enabled = true,
  initialFilters,
}: UseVideoListFiltersOptions) {
  const [filters, setFilters] = useState<VideoFiltersValue>(() => ({
    ...INITIAL_VIDEO_FILTERS,
    ...initialFilters,
  }));


  const { users } = useUsers();
  const { types, fetchAll: fetchTypes } = useTypes();
  const { discipline: disciplines, fetchAll: fetchDisciplines } = useDiscipline();
  const { tags, fetchAll: fetchTags } = useTags();

  const fetchedMetadataRef = useRef(false);

  const videoListParams = useMemo<VideoListParams>(
    () => ({
      ordering: filters.ordering || undefined,
      channel: filters.channel ?? undefined,
      typeSlugs: filters.typeSlugs,
      disciplineIds: filters.disciplineIds,
      tagSlugs: filters.tagSlugs,
      cursusSlugs: filters.cursus,
      ownerUsernames: filters.ownerUsernames,
      search: filters.search || undefined,
      page: filters.page || 1,
    }),
    [filters]
  );

  const {
    videos,
    videosCount,
    useVideoError,
    useVideoLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useVideosList(videoListParams, mode === "dashboard" ? "me" : "all", { enabled });

  useEffect(() => {
    if (!fetchedMetadataRef.current) {
      fetchedMetadataRef.current = true;
      fetchTypes();
      fetchDisciplines();
      fetchTags();
    }
  }, [fetchTypes, fetchDisciplines, fetchTags]);

  const channels = useMemo<number[]>(() => {
    return Array.from(
      new Set(
        videos
          .map((video) => video.channel)
          .filter((channel): channel is number => channel != null)
      )
    );
  }, [videos]);

  return {
    filters,
    setFilters,
    videos,
    videosCount,
    users,
    types,
    disciplines,
    tags,
    channels,
    useVideoError,
    useVideoLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
}
