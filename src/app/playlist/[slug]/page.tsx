"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import { usePlaylist } from "@/src/hooks/usePlaylist";
import { useAuth } from "@/src/context/AuthProvider";
import { usePlaylistCreationContext } from "@/src/context/PlaylistCreationContext";
import BackButton from "@/src/components/BackButton/BackButton";
import VideosDisplay from "@/src/components/video/display/VideoDisplay";
import { formatDateWithTime, timeAgo } from "@/src/constants/date";
import { capitalize } from "@/src/utils/helper";
import VideoFilters from "@/src/components/video/filters/VideoFilters";
import styles from "./styles.module.css";
import { useVideoListFilters } from "@/src/hooks/useVideoListFilters";
import { useMounted } from "@/src/hooks/useMounted";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useTranslation } from "@/src/hooks/useTranslation";

export default function PlaylistPage() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { playlist, fetchOne, usePlaylistError, usePlaylistLoading } =
    usePlaylist();
  const { user } = useAuth();
  const mounted = useMounted();
  const { lastCreatedPlaylist } = usePlaylistCreationContext();

  const playlistJustCreated =
    lastCreatedPlaylist != null && lastCreatedPlaylist.slug === slug;

  useEffect(() => {
    if (!slug) return;
    void fetchOne(slug);
  }, [fetchOne, slug]);

  // If the playlist was just created, reuse the one from the context
  const effectivePlaylist =
    playlist ?? (playlistJustCreated ? lastCreatedPlaylist : null);

  const playlistItems = effectivePlaylist?.items ?? [];

  const {
    filters,
    setFilters,
    users,
    types,
    disciplines,
    tags,
    channels,
    useVideoError,
    useVideoLoading,
  } = useVideoListFilters({ mode: "all", enabled: false });

  // Apply the default sorting defined for the playlist
  useEffect(() => {
    if (!effectivePlaylist?.default_order) return;

    setFilters((prev) => {
      if (prev.ordering) return prev;
      return { ...prev, ordering: effectivePlaylist.default_order };
    });
  }, [effectivePlaylist?.default_order, setFilters]);

  // Raw videos from the playlist (without filters)
  const playlistItemVideos = playlistItems
    .map((item) => item.video)
    .filter((video) => video != null);

  const filteredPlaylistVideos = useMemo(() => {
    if (!playlistItemVideos.length) {
      return [];
    }

    let result = playlistItemVideos;
    const search = filters.search?.trim().toLowerCase();
    if (search) {
      result = result.filter((video) =>
        video.title.toLowerCase().includes(search),
      );
    }

    const ordering = filters.ordering;
    if (ordering) {
      result = [...result].sort((a, b) => {
        switch (ordering) {
          case "-created_at":
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          case "created_at":
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          case "-title":
            return b.title.localeCompare(a.title);
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [playlistItemVideos, filters.search, filters.ordering]);

  const userId = user?.id;
  const ownerId = effectivePlaylist?.owner;
  const isOwner = useMemo(
    () => userId != null && ownerId === userId,
    [ownerId, userId],
  );

  const handleStartPlaylist = () => {
    if (!playlistItemVideos.length || !effectivePlaylist?.slug) return;

    const firstVideo = playlistItemVideos[0];
    if (!firstVideo?.slug) return;

    router.push(`/video/${firstVideo.slug}?playlist=${effectivePlaylist.slug}`);
  };

  if (!slug) {
    return (
      <Alert type={VariantType.ERROR} canClose>
        {t("playlist.noResults")}
      </Alert>
    );
  }

  const loading = usePlaylistLoading && !lastCreatedPlaylist;

  if (loading || !mounted || !effectivePlaylist) {
    return <CenteredLoader />;
  }

  if (usePlaylistError && !effectivePlaylist) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Alert type={VariantType.ERROR} canClose>
          {usePlaylistError ?? `${t("playlists.unableToLoad")} ${slug}`}
        </Alert>
        <BackButton label={t("common.back")} />
      </div>
    );
  }

  return (
    <div>
      <BackButton label={t("common.back")} />
      <div className={styles["playlist-content"]}>
        {playlistJustCreated && (
          <Alert type={VariantType.SUCCESS} aria-live="polite">
            {t("playlist.playlistCreated")}
          </Alert>
        )}
        <div className={styles["playlist-header-row"]}>
          <div>
            <h1>{capitalize(effectivePlaylist?.title ?? "")}</h1>
            <div className={styles["playlist-actions"]}>
              <Button
                color="brand"
                variant="primary"
                size="small"
                onClick={handleStartPlaylist}
              >
                <PlayArrowIcon />
                {t("favorites.startPlaylist")}
              </Button>
              {isOwner && (
                <>
                  <Button
                    color="brand"
                    variant="secondary"
                    size="small"
                    onClick={() =>
                      router.push(`/playlist/edit/${effectivePlaylist?.slug}`)
                    }
                  >
                    {t("playlist.editPlaylist")}
                  </Button>
                  <Button
                    color="error"
                    variant="primary"
                    size="small"
                    onClick={() =>
                      router.push(`/playlist/delete/${effectivePlaylist?.slug}`)
                    }
                  >
                    {t("playlists.delete")}
                  </Button>
                </>
              )}
            </div>
            {effectivePlaylist.description && (
              <div className={styles["playlist-description"]}>
                <p>{effectivePlaylist.description}</p>
              </div>
            )}

            <dl className={styles["playlist-infos-details"]}>
              <div>
                <dt>{timeAgo(effectivePlaylist?.created_at, locale)}</dt>
              </div>
              <div>
                <dt>{t("common.createdBy")}</dt>
                <dd>
                  {effectivePlaylist?.owner_username ?? `${t("common.unknown")}`}
                </dd>
              </div>

              <div>
                <dt>{t("common.latestUpdate")}</dt>
                <dd>
                  {formatDateWithTime(effectivePlaylist?.updated_at, locale)}
                </dd>
              </div>

              <div>
                <dt>{t("common.playlistStatus")}</dt>
                {!effectivePlaylist?.is_public && (
                  <dd>{t("common.private")}</dd>
                )}
                {effectivePlaylist?.is_public && <dd>{t("common.public")}</dd>}
                {effectivePlaylist?.is_protected && (
                  <dd>{t("common.passwordProtected")}</dd>
                )}
              </div>
            </dl>
          </div>
        </div>

        {effectivePlaylist.items && playlistItemVideos.length > 0 ? (
          <div>
            {useVideoError && (
              <div style={{ marginBottom: "1rem" }}>
                <Alert canClose type={VariantType.ERROR}>
                  {useVideoError}
                </Alert>
              </div>
            )}

            <VideoFilters
              value={filters}
              users={user ? users : []}
              types={types}
              disciplines={disciplines}
              tags={tags}
              channels={channels}
              showUserFilter={!!user}
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

            {useVideoLoading ? (
              <CenteredLoader />
            ) : filteredPlaylistVideos.length > 0 ? (
              <VideosDisplay
                videos={filteredPlaylistVideos}
                page={filters.page}
                onPageChange={(page) => setFilters({ ...filters, page })}
                currentUserId={user?.id}
              />
            ) : (
              <Alert>{t("playlists.noVideos")}</Alert>
            )}
          </div>
        ) : (
          <Alert>{t("table.noVideosFound")}</Alert>
        )}
      </div>
    </div>
  );
}
