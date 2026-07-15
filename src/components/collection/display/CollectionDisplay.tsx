"use client";

import { useEffect, useMemo, useState } from "react";
import { Pagination, usePagination } from "@openfun/cunningham-react";
import CollectionsList from "@/src/components/collection/CollectionList";
import PlaylistList from "@/src/components/collection/PlaylistList";
import type { CollectionDisplayProps, CollectionViewMode } from "./types";
import { mapCollectionsToDisplayRows } from "./CollectionDisplay.mapper";
import CollectionGrid from "./CollectionGrid";
import CollectionViewToggle from "./CollectionViewToggle";
import styles from "./styles.module.css";

const getCollectionsLabel = (
  rowsLength: number,
  channelsCount: number,
  themesCount: number,
  playlistsCount: number,
) => {
  const isPlural = rowsLength > 1;

  if (channelsCount > 0) {
    return isPlural ? "chaînes" : "chaîne";
  }

  if (themesCount > 0) {
    return isPlural ? "thèmes" : "thème";
  }

  if (playlistsCount > 0) {
    return isPlural ? "listes de lecture" : "liste de lecture";
  }

  return isPlural ? "collections" : "collection";
};

export default function CollectionDisplay({
  channels = [],
  themes = [],
  playlists = [],
  videos = [],
  defaultView = "cards",
  storageKey,
  pageSize = 20,
  channelSlug,
  basePath,
  currentUserId,
  collectionsCount,
  page: externalPage,
  onPageChange,
  loading = false,
}: CollectionDisplayProps) {
  const [view, setView] = useState<CollectionViewMode>(defaultView);

  useEffect(() => {
    if (!storageKey) return;
    const storedView = window.localStorage.getItem(storageKey);
    if (storedView === "cards" || storedView === "grid") {
      setView(storedView);
    }
  }, [storageKey]);

  const handleChangeView = (nextView: CollectionViewMode) => {
    setView(nextView);
    if (storageKey) {
      window.localStorage.setItem(storageKey, nextView);
    }
  };

  const rows = useMemo(
    () =>
      mapCollectionsToDisplayRows({
        channels,
        themes,
        playlists,
        videos,
        channelSlug,
        basePath,
        currentUserId,
      }),
    [channels, themes, playlists, videos, channelSlug, basePath, currentUserId],
  );

  const pagination = usePagination({
    defaultPagesCount: 1,
    defaultPage: externalPage ?? 1,
    pageSize,
  });

  const { page: internalPage, setPage, pagesCount, setPagesCount } = pagination;

  const page = externalPage ?? internalPage;
  const count = collectionsCount ?? rows.length;

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

  const paginatedRows = useMemo(() => {
    if (collectionsCount !== undefined) {
      return rows;
    }
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize, collectionsCount]);

  const paginatedChannels = useMemo(
    () =>
      channels.filter((channel) =>
        paginatedRows.some((row) => row.id === `channel-${channel.id}`),
      ),
    [channels, paginatedRows],
  );

  const paginatedThemes = useMemo(
    () =>
      themes.filter((theme) =>
        paginatedRows.some((row) => row.id === `theme-${theme.id}`),
      ),
    [themes, paginatedRows],
  );

  const paginatedPlaylists = useMemo(
    () =>
      playlists.filter((playlist) =>
        paginatedRows.some((row) => row.id === `playlist-${playlist.id}`),
      ),
    [playlists, paginatedRows],
  );

  const label = getCollectionsLabel(
    rows.length,
    channels.length,
    themes.length,
    playlists.length,
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <p>
          {count} {label} trouvée{count > 1 ? "s" : ""}
        </p>
        <CollectionViewToggle view={view} onChange={handleChangeView} />
      </div>

      {view === "cards" ? (
        <>
          <CollectionsList
            channels={paginatedChannels}
            themes={paginatedThemes}
            channelSlug={channelSlug}
            basePath={basePath}
            loading={loading}
          />
          <PlaylistList playlists={paginatedPlaylists} loading={loading} />
        </>
      ) : (
        <CollectionGrid rows={paginatedRows} />
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
