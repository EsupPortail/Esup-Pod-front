"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { useDiscipline } from "@/src/hooks/useDiscipline";
import { useTags } from "@/src/hooks/useTags";
import { useTypes } from "@/src/hooks/useTypes";
import { useUsers } from "@/src/hooks/useUsers";
import { useVideos, type VideoListParams } from "@/src/hooks/useVideos";
import {
  INITIAL_VIDEO_FILTERS,
  type VideoFiltersValue,
} from "@/src/components/video/filters/VideoFilters";

type UseVideoListFiltersOptions = {
  mode: "all" | "dashboard";
  enabled?: boolean;
  /**
   *  Initialiser les filtres (ex=?search=...)
   */
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
  const [channels, setChannels] = useState<number[]>([]);

  const { user } = useAuth();
  const { users, fetchAll: fetchUsers } = useUsers();
  const { types, fetchAll: fetchTypes } = useTypes();
  const { discipline: disciplines, fetchAll: fetchDisciplines } =
    useDiscipline();
  const { tags, fetchAll: fetchTags } = useTags();

  const {
    videos,
    fetchAll,
    fetchVideoUserWithCoOwners,
    useVideoError,
    useVideoLoading,
  } = useVideos();

  const fetchedMetadataRef = useRef(false);
  const fetchedUsersForUserIdRef = useRef<number | null>(null);
  const lastVideoRequestKeyRef = useRef<string | null>(null);

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
    }),
    [
      filters.ordering,
      filters.channel,
      filters.typeSlugs,
      filters.disciplineIds,
      filters.tagSlugs,
      filters.cursus,
      filters.ownerUsernames,
      filters.search,
    ],
  );

  const videoListRequestKey = useMemo(
    () =>
      JSON.stringify({
        mode,
        userId: user?.id ?? null,
        ...videoListParams,
      }),
    [mode, user?.id, videoListParams],
  );

  useEffect(() => {
    if (user && fetchedUsersForUserIdRef.current !== user.id) {
      fetchedUsersForUserIdRef.current = user.id;
      fetchUsers();
    }

    if (!fetchedMetadataRef.current) {
      fetchedMetadataRef.current = true;
      fetchTypes();
      fetchDisciplines();
      fetchTags();
    }
  }, [user, fetchUsers, fetchTypes, fetchDisciplines, fetchTags]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (lastVideoRequestKeyRef.current === videoListRequestKey) {
      return;
    }

    lastVideoRequestKeyRef.current = videoListRequestKey;

    const fetchVideos =
      mode === "dashboard"
        ? fetchVideoUserWithCoOwners(user?.id, videoListParams)
        : fetchAll(videoListParams);

    fetchVideos.then((nextVideos) => {
      setChannels((currentChannels) =>
        currentChannels.length > 0
          ? currentChannels
          : Array.from(
              new Set(
                nextVideos
                  .map((video) => video.channel)
                  .filter((channel): channel is number => channel != null),
              ),
            ),
      );
    });
  }, [
    enabled,
    mode,
    user?.id,
    fetchAll,
    fetchVideoUserWithCoOwners,
    videoListParams,
    videoListRequestKey,
  ]);

  return {
    filters,
    setFilters,
    videos,
    users,
    types,
    disciplines,
    tags,
    channels,
    useVideoError,
    useVideoLoading,
  };
}
