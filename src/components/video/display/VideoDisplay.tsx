"use client";

import { useEffect, useMemo, useState } from "react";
import { Checkbox, Pagination, usePagination } from "@openfun/cunningham-react";
import VideosList from "@/src/components/video/VideosList";
import type { VideoViewMode, VideosDisplayProps } from "./types";
import { mapVideosToDisplayRows } from "./VideoDisplay.mapper";
import VideoGrid from "./VideoGrid";
import VideoViewToggle from "./VideoViewToggle";
import styles from "./styles.module.css";

export default function VideosDisplay({
  videos,
  currentUserId,
  defaultView = "cards",
  storageKey,
  pageSize = 20,
  videosCount,
  page: externalPage,
  onPageChange,
  loading = false,
  selectable = false,
  selectedVideoIds = [],
  onSelectVideo,
  onSelectAll,
}: VideosDisplayProps) {
  const [view, setView] = useState<VideoViewMode>(defaultView);

  useEffect(() => {
    if (!storageKey) return;
    const storedView = window.localStorage.getItem(storageKey);
    if (storedView === "cards" || storedView === "grid") {
      setView(storedView);
    }
  }, [storageKey]);

  const handleChangeView = (nextView: VideoViewMode) => {
    setView(nextView);
    if (storageKey) {
      window.localStorage.setItem(storageKey, nextView);
    }
  };

  const pagination = usePagination({
    defaultPagesCount: 1,
    defaultPage: externalPage ?? 1,
    pageSize,
  });

  const { page: internalPage, setPage, pagesCount, setPagesCount } = pagination;

  const page = externalPage ?? internalPage;
  const count = videosCount ?? videos.length;

  useEffect(() => {
    if (externalPage !== undefined) {
      setPage(externalPage);
    }
  }, [externalPage, setPage]);

  useEffect(() => {
    const nextPagesCount = Math.max(1, Math.ceil(count / pageSize));
    setPagesCount(nextPagesCount);
    if (externalPage === undefined) {
      setPage((currentPage) => Math.min(currentPage, nextPagesCount));
    }
  }, [count, pageSize, setPage, setPagesCount, externalPage]);

  const paginatedVideos = useMemo(() => {
    if (videosCount !== undefined) {
      // If server-side paginated, videos array is already the current page
      return videos;
    }
    const start = (page - 1) * pageSize;
    return videos.slice(start, start + pageSize);
  }, [videos, page, pageSize, videosCount]);

  const gridRows = useMemo(() => {
    return mapVideosToDisplayRows(
      paginatedVideos,
      currentUserId,
      selectedVideoIds,
      onSelectVideo
    );
  }, [paginatedVideos, currentUserId, selectedVideoIds, onSelectVideo]);

  const isAllSelected = useMemo(() => {
    if (paginatedVideos.length === 0) return false;
    return paginatedVideos.every((v) => selectedVideoIds.includes(v.id));
  }, [paginatedVideos, selectedVideoIds]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {selectable && (
            <div style={{ transform: "scale(0.85)", transformOrigin: "left center" }}>
              <Checkbox
                label="Tout sélectionner"
                checked={isAllSelected}
                onChange={(e) => onSelectAll?.((e.target as HTMLInputElement).checked)}
                aria-label="Sélectionner toutes les vidéos de la page"
              />
            </div>
          )}

          <p>
            {count} vidéo{count > 1 ? "s" : ""} trouvée{count > 1 ? "s" : ""}
          </p>
        </div>

        <VideoViewToggle view={view} onChange={handleChangeView} />
      </div>

      {view === "cards" ? (
        <VideosList
          videosList={paginatedVideos}
          loading={loading}
          selectable={selectable}
          selectedVideoIds={selectedVideoIds}
          onSelectVideo={onSelectVideo}
        />
      ) : (
        <VideoGrid rows={gridRows} selectable={selectable} />
      )}

      {pagesCount && pagesCount > 1 && (
        <div className={styles.pagination}>
          <Pagination
            {...pagination}
            page={page}
            onPageChange={(p) => {
              setPage(p);
              onPageChange?.(p);
            }}
            pageSize={pageSize}
            displayGoto={false}
          />
        </div>
      )}
    </div>
  );
}
