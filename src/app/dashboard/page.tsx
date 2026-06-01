"use client";

import VideosDisplay from "@/src/components/video/display/VideoDisplay";
import { Loader, Alert } from "@openfun/cunningham-react";
import { useVideos } from "@/src/hooks/useVideos";
import { useAuth } from "@/src/context/AuthProvider";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useUsers } from "@/src/hooks/useUsers";
import { useTypes } from "@/src/hooks/useTypes";
import { useDiscipline } from "@/src/hooks/useDiscipline";
import { useTags } from "@/src/hooks/useTags";
import VideoFilters, {
  INITIAL_VIDEO_FILTERS,
} from "@/src/components/video/filters/VideoFilters";

export const breadcrumbLabel = "Tableau de bord";

export default function Dashboard() {
  const [filters, setFilters] = useState(INITIAL_VIDEO_FILTERS);
  const { fetchVideoUser, videos, fetchAll, useVideoError, useVideoLoading } =
    useVideos();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { user } = useAuth();
  const { users, fetchAll: fetchUsers } = useUsers();
  const { types, fetchAll: fetchTypes } = useTypes();
  const [channels, setChannels] = useState<number[]>([]);
  const fetchedMetadataRef = useRef(false);
  const fetchedUsersForUserIdRef = useRef<number | null>(null);
  const lastVideoRequestKeyRef = useRef<string | null>(null);
  const { discipline: disciplines, fetchAll: fetchDisciplines } =
    useDiscipline();
  const { tags, fetchAll: fetchTags } = useTags();

  const videoListParams = useMemo(
    () => ({
      ordering: filters.ordering || undefined,
      channel: filters.channel ?? undefined,
      typeSlugs: filters.typeSlugs,
      disciplineIds: filters.disciplineIds,
      tagSlugs: filters.tagSlugs,
      search: filters.search || undefined,
    }),
    [
      filters.ordering,
      filters.channel,
      filters.typeSlugs,
      filters.disciplineIds,
      filters.tagSlugs,
      filters.search,
    ],
  );
  const videoListRequestKey = useMemo(
    () =>
      JSON.stringify({
        userId: user?.id ?? null,
        ...videoListParams,
      }),
    [user?.id, videoListParams],
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
    if (lastVideoRequestKeyRef.current === videoListRequestKey) {
      return;
    }

    lastVideoRequestKeyRef.current = videoListRequestKey;

    fetchAll(videoListParams).then((nextVideos) => {
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
  }, [fetchAll, videoListParams, videoListRequestKey]);

  useEffect(() => {
    // fetchVideoUser seulement quand l'auth est ok
    // pour eviter une erreur 401 au refresh.
    if (!mounted || isInitializing || !isAuthenticated) {
      return;
    }
    fetchVideoUser();
  }, [fetchVideoUser, mounted, isInitializing, isAuthenticated]);

  if (!mounted || isInitializing || !isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h1>Mon tableau de bord</h1>
      {useVideoError && (
        <Alert canClose type="error">
          {useVideoError}
        </Alert>
      )}
      <VideoFilters
        value={filters}
        users={user ? users : []}
        types={types}
        disciplines={disciplines}
        tags={tags}
        channels={channels}
        showUserFilter={!!user}
        onChange={setFilters}
      />

      {useVideoLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : videos.length === 0 ? (
        <p>Aucune vidéo trouvée.</p>
      ) : (
        <div>
          <VideosDisplay
            videos={videos}
            currentUserId={user?.id}
            defaultView="grid"
            storageKey="dashboard-videos-view"
          />
        </div>
      )}
    </div>
  );
}
