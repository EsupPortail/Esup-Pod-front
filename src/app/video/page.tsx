"use client";

import VideosDisplay from "@/src/components/video/display/VideoDisplay";
import { Alert, VariantType } from "@openfun/cunningham-react";
import { useAuth } from "@/src/context/AuthProvider";
import { useMemo } from "react";
import VideoFilters from "@/src/components/video/filters/VideoFilters";
import type { VideoFiltersValue } from "@/src/components/video/filters/VideoFilters";
import BackButton from "@/src/components/BackButton/BackButton";
import { useVideoListFilters } from "@/src/hooks/useVideoListFilters";
import { useSearchParams } from "next/navigation";
import { useMounted } from "@/src/hooks/useMounted";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";

export const breadcrumbLabel = "Toutes les vidéos";

export default function Videos() {
  const { user, isInitializing } = useAuth();
  const mounted = useMounted();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") ?? "";
  const initialTagSlug = searchParams.get("tag");

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
    mode: "all",
    initialFilters: {
      search: initialSearch,
      ...(initialTagSlug ? { tagSlugs: [initialTagSlug] } : {}),
    },
  });

  const visibleAndPublicVideos = useMemo(() => {
    return videos.filter(
      (video) =>
        (!video.is_auth_required || !!user) &&
        video.status !== "DR" &&
        video.encoding_status === "DO",
    );
  }, [videos, user]);

  const hasActiveFilters = useMemo(() => {
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

  if (!mounted || isInitializing) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <BackButton label="Retour" />
      <h1>Toutes les vidéos</h1>

      {useVideoError && (
        <Alert canClose type={VariantType.ERROR}>
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
        <CenteredLoader />
      ) : visibleAndPublicVideos.length === 0 ? (
        <Alert>
          {hasActiveFilters
            ? "Aucune vidéo ne correspond à vos filtres."
            : "Aucune vidéo publique disponible pour le moment."}
        </Alert>
      ) : (
        <VideosDisplay
          videos={visibleAndPublicVideos}
          currentUserId={user?.id}
          defaultView="cards"
          storageKey="all-videos-view"
        />
      )}
    </div>
  );
}
