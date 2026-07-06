"use client";

import { useMemo } from "react";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import VideosDisplay from "@/src/components/video/display/VideoDisplay";
import VideoFilters, {
  type VideoFiltersValue,
} from "@/src/components/video/filters/VideoFilters";
import { useAuth } from "@/src/context/AuthProvider";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useVideoListFilters } from "@/src/hooks/useVideoListFilters";
import { Alert, VariantType } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";

import type { Video } from "@/src/types";

export const breadcrumbLabel = "Tableau de bord";

export default function Dashboard() {
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { user } = useAuth();

  const {
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
  } = useVideoListFilters({
    mode: "dashboard",
    enabled: mounted && !isInitializing && isAuthenticated,
  });

  const filteredDashboardVideos: Video[] = useMemo(() => {
    let result = videos;

    // Recherche texte
    if (filters.search.trim() !== "") {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(searchLower) ||
          (video.description ?? "").toLowerCase().includes(searchLower),
      );
    }

    // Propriétaires
    if (filters.ownerUsernames.length > 0) {
      const ownersSet = new Set(filters.ownerUsernames);

      const selectedUserIds = new Set(
        users
          .filter((user) => ownersSet.has(user.username))
          .map((user) => user.id),
      );

      result = result.filter((video) => {
        const ownerMatch = ownersSet.has(video.owner ?? "");
        const coOwnerMatch = (video.co_owners ?? []).some((coOwnerId) =>
          selectedUserIds.has(coOwnerId),
        );

        return ownerMatch || coOwnerMatch;
      });
    }

    // Types
    if (filters.typeSlugs.length > 0) {
      const typeSet = new Set(filters.typeSlugs);
      result = result.filter(
        (video) => video.type_name && typeSet.has(video.type_name),
      );
    }

    // Disciplines
    if (filters.disciplineIds.length > 0) {
      const disciplineSet = new Set(filters.disciplineIds);
      result = result.filter((video) =>
        (video.discipline ?? []).some((disciplineId) =>
          disciplineSet.has(disciplineId),
        ),
      );
    }

    // Tags
    if (filters.tagSlugs.length > 0) {
      const tagSet = new Set(filters.tagSlugs);
      result = result.filter((video) =>
        (video.tags ?? []).some((tag) => tagSet.has(tag)),
      );
    }

    // Chaîne
    if (filters.channel != null) {
      result = result.filter(
        (video) => (video.channel as number | null) === filters.channel,
      );
    }

    // Tri
    if (filters.ordering === "-created_at") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else if (filters.ordering === "created_at") {
      result = [...result].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    } else if (filters.ordering === "title") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" }),
      );
    } else if (filters.ordering === "-title") {
      result = [...result].sort((a, b) =>
        b.title.localeCompare(a.title, "fr", { sensitivity: "base" }),
      );
    }

    return result;
  }, [videos, filters, users]);

  const hasActiveVideoFilters = useMemo(() => {
    const base: VideoFiltersValue = filters;

    return (
      base.search.trim().length > 0 ||
      base.channel !== null ||
      base.ownerUsernames.length > 0 ||
      base.typeSlugs.length > 0 ||
      base.disciplineIds.length > 0 ||
      base.cursus.length > 0 ||
      base.tagSlugs.length > 0
    );
  }, [filters]);

  const isInitialLoading = useVideoLoading && videos.length === 0;

  if (!mounted || isInitializing || !isAuthenticated) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <BackButton />
      <h1>Mon tableau de bord</h1>

      {useVideoError && (
        <Alert canClose type={VariantType.ERROR}>
          {useVideoError}
        </Alert>
      )}

      {isInitialLoading ? (
        <CenteredLoader />
      ) : (
        <div>
          <VideoFilters
            value={filters}
            users={user ? users : []}
            types={types}
            disciplines={disciplines}
            tags={tags}
            channels={channels}
            showUserFilter={false}
            onChange={setFilters}
          />

          {filteredDashboardVideos.length === 0 ? (
            <Alert type={VariantType.INFO}>
              {hasActiveVideoFilters
                ? "Aucune vidéo ne correspond à vos filtres."
                : "Aucune vidéo trouvée."}
            </Alert>
          ) : (
            <VideosDisplay
              videos={filteredDashboardVideos}
              currentUserId={user?.id}
              defaultView="grid"
              storageKey="dashboard-videos-view"
            />
          )}
        </div>
      )}
    </div>
  );
}
