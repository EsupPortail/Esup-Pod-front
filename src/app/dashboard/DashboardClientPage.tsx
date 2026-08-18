"use client";

import { useMemo, useState } from "react";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import VideosDisplay from "@/src/components/video/display/VideoDisplay";
import VideoFilters, {
  type VideoFiltersValue,
} from "@/src/components/video/filters/VideoFilters";
import BulkActionsBar from "@/src/components/video/bulk/BulkActionsBar";
import { useAuth } from "@/src/context/AuthProvider";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useVideoListFilters } from "@/src/hooks/useVideoListFilters";
import { Alert, VariantType } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";

import type { Video } from "@/src/types";

import { useTranslation } from "@/src/hooks/useTranslation";

export const breadcrumbLabel = "Tableau de bord";

export default function Dashboard() {
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedVideoIds, setSelectedVideoIds] = useState<number[]>([]);

  const {
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
  } = useVideoListFilters({
    mode: "dashboard",
    enabled: mounted && !isInitializing && isAuthenticated,
  });

  const selectedVideos = useMemo(() => {
    return videos.filter((video) => selectedVideoIds.includes(video.id));
  }, [videos, selectedVideoIds]);

  const handleSelectVideo = (videoId: number, checked?: boolean) => {
    setSelectedVideoIds((prev) => {
      const isCurrentlySelected = prev.includes(videoId);
      const shouldBeSelected = checked !== undefined ? checked : !isCurrentlySelected;
      if (shouldBeSelected) {
        return prev.includes(videoId) ? prev : [...prev, videoId];
      } else {
        return prev.filter((id) => id !== videoId);
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = videos.map((v) => v.id);
      setSelectedVideoIds((prev) => [...new Set([...prev, ...allIds])]);
    } else {
      const pageIds = new Set(videos.map((v) => v.id));
      setSelectedVideoIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

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
      <h1 style={{ marginTop: "16px", marginBottom: "28px" }}>{t("sidebar.dashboard")}</h1>

      {useVideoError && (
        <Alert canClose type={VariantType.ERROR}>
          {useVideoError}
        </Alert>
      )}

      {isInitialLoading ? (
        <CenteredLoader />
      ) : (
        <div>
          <BulkActionsBar
            selectedVideos={selectedVideos}
            types={types}
            disciplines={disciplines}
            tags={tags}
            channels={channels}
            onApplySuccess={() => setSelectedVideoIds([])}
            onClearSelection={() => setSelectedVideoIds([])}
          />

          <VideoFilters
            value={filters}
            users={user ? users : []}
            types={types}
            disciplines={disciplines}
            tags={tags}
            channels={channels}
            showUserFilter={false}
            onChange={(newFilters) => {
              if (
                newFilters.search !== filters.search ||
                newFilters.channel !== filters.channel ||
                newFilters.ordering !== filters.ordering ||
                newFilters.ownerUsernames !== filters.ownerUsernames ||
                newFilters.typeSlugs !== filters.typeSlugs ||
                newFilters.disciplineIds !== filters.disciplineIds ||
                newFilters.cursus !== filters.cursus ||
                newFilters.tagSlugs !== filters.tagSlugs
              ) {
                newFilters.page = 1;
              }
              setFilters(newFilters);
            }}
          />

          {videos.length === 0 ? (
            <Alert type={VariantType.INFO}>
              {hasActiveVideoFilters
                ? "Aucune vidéo ne correspond à vos filtres."
                : "Aucune vidéo trouvée."}
            </Alert>
          ) : (
            <VideosDisplay
              videos={videos}
              videosCount={videosCount}
              page={filters.page}
              onPageChange={(page) => setFilters({ ...filters, page })}
              currentUserId={user?.id}
              defaultView="grid"
              storageKey="dashboard-videos-view"
              selectable={true}
              selectedVideoIds={selectedVideoIds}
              onSelectVideo={handleSelectVideo}
              onSelectAll={handleSelectAll}
            />
          )}
        </div>
      )}
    </div>
  );
}
