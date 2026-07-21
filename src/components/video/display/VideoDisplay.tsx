"use client";

import { useEffect, useMemo, useState } from "react";
import { Pagination, usePagination } from "@openfun/cunningham-react";
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
    return mapVideosToDisplayRows(paginatedVideos, currentUserId);
  }, [paginatedVideos, currentUserId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <p>
          {count} vidéo{count > 1 ? "s" : ""} trouvée{count > 1 ? "s" : ""}
        </p>

        <VideoViewToggle view={view} onChange={handleChangeView} />
      </div>

      {view === "cards" ? (
        <VideosList videosList={paginatedVideos} loading={loading} />
      ) : (
        <VideoGrid rows={gridRows} />
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
