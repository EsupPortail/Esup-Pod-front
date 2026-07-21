"use client";
import { useEffect, useMemo } from "react";
import { Pagination, usePagination } from "@openfun/cunningham-react";
import type { Video } from "@/src/types";
import VideosList from "@/src/components/video/VideosList";
import styles from "./page.module.css";

interface PaginateVideosProps {
  videos: Video[];
  pageSize?: number;
}

export default function PaginateVideos({
  videos,
  pageSize = 20,
}: PaginateVideosProps) {
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

  return (
    <>
      <VideosList videosList={paginatedVideos} />
      {pagesCount && pagesCount > 1 && (
        <div className={styles.pagination}>
          <Pagination {...pagination} pageSize={pageSize} displayGoto={false} />
        </div>
      )}
    </>
  );
}
