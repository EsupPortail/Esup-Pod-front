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
    defaultPage: 1,
    pageSize,
  });

  const { page, setPage, pagesCount, setPagesCount } = pagination;

  useEffect(() => {
    const nextPagesCount = Math.max(1, Math.ceil(videos.length / pageSize));
    setPagesCount(nextPagesCount);
    setPage((currentPage) => Math.min(currentPage, nextPagesCount));
  }, [videos.length, pageSize, setPage, setPagesCount]);

  const paginatedVideos = useMemo(() => {
    const start = (page - 1) * pageSize;
    return videos.slice(start, start + pageSize);
  }, [videos, page, pageSize]);

  const gridRows = useMemo(() => {
    return mapVideosToDisplayRows(paginatedVideos, currentUserId);
  }, [paginatedVideos, currentUserId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <p>
          {videos.length} vidéo{videos.length > 1 ? "s" : ""} trouvée
          {videos.length > 1 ? "s" : ""}
        </p>

        <VideoViewToggle view={view} onChange={handleChangeView} />
      </div>

      {view === "cards" ? (
        <VideosList videosList={paginatedVideos} />
      ) : (
        <VideoGrid rows={gridRows} />
      )}

      {pagesCount && pagesCount > 1 && (
        <div className={styles.pagination}>
          <Pagination {...pagination} pageSize={pageSize} displayGoto={false} />
        </div>
      )}
    </div>
  );
}
