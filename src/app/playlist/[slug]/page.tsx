"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Button, Loader, VariantType } from "@openfun/cunningham-react";
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

export const breadcrumbLabel = "Playlist";

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { playlist, fetchOne, usePlaylistError, usePlaylistLoading } =
    usePlaylist();
  const { user } = useAuth();
  const mounted = useMounted();
  const { lastCreatedPlaylist, setLastCreatedPlaylist } =
    usePlaylistCreationContext();

  const playlistJustCreated =
    lastCreatedPlaylist != null && lastCreatedPlaylist.slug === slug;

  useEffect(() => {
    if (!slug) return;
    fetchOne(slug);
  }, [fetchOne, slug]);

  // Si on vient juste de créer la playlist, on réutilise celle du contexte
  const effectivePlaylist =
    playlist ?? (playlistJustCreated ? lastCreatedPlaylist : null);

  const playlistItems = effectivePlaylist?.items ?? [];

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
  } = useVideoListFilters({ mode: "all", enabled: false });

  // Applique le tri par défaut défini sur la playlist
  useEffect(() => {
    if (!effectivePlaylist?.default_order) return;

    setFilters((prev) => {
      if (prev.ordering) return prev;
      return { ...prev, ordering: effectivePlaylist.default_order };
    });
  }, [effectivePlaylist?.default_order, setFilters]);

  // Vidéos brutes de la playlist (sans filtres)
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
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case "created_at":
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
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
        Playlist introuvable.
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
          {usePlaylistError ?? "Impossible de charger la playlist."}
        </Alert>
        <BackButton label="Retour" />
      </div>
    );
  }

  return (
    <div>
      <BackButton label="Retour" />
      <div className={styles.playlist_content}>
        {playlistJustCreated && (
          <Alert type={VariantType.SUCCESS} aria-live="polite">
            Votre liste de lecture a été créée avec succès! 🥳
          </Alert>
        )}
        <div className={styles.playlist_header_row}>
          <div>
            <h1>{capitalize(effectivePlaylist?.title ?? "")}</h1>
            <div className={styles.playlist_actions}>
              <Button
                color="brand"
                variant="primary"
                size="small"
                onClick={handleStartPlaylist}
              >
                <PlayArrowIcon />
                Lancer la liste de lecture
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
                    Éditer la liste de lecture
                  </Button>
                  <Button
                    color="error"
                    variant="primary"
                    size="small"
                    onClick={() =>
                      router.push(`/playlist/delete/${effectivePlaylist?.slug}`)
                    }
                  >
                    Supprimer la liste de lecture
                  </Button>
                </>
              )}
            </div>
            {effectivePlaylist.description && (
              <div className={styles.playlist_description}>
                <p>{effectivePlaylist.description}</p>
              </div>
            )}

            <dl className={styles.playlist_infos_details}>
              <div>
                <dt>{timeAgo(effectivePlaylist?.created_at)}</dt>
              </div>
              <div>
                <dt>Créée par :</dt>
                <dd>
                  {effectivePlaylist?.owner_username ?? "Utilisateur inconnu"}
                </dd>
              </div>

              <div>
                <dt>Mis à jour le :</dt>
                <dd>{formatDateWithTime(effectivePlaylist?.updated_at)}</dd>
              </div>

              <div>
                <dt>Statut de la liste de lecture : </dt>
                {!effectivePlaylist?.is_public && <dd>Privée</dd>}
                {effectivePlaylist?.is_public && <dd>Publique</dd>}
                {effectivePlaylist?.is_protected && (
                  <dd>Protégée par mot de passe</dd>
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
              <Alert>Aucune vidéo ne correspond à vos filtres.</Alert>
            )}
          </div>
        ) : (
          <Alert>Aucune vidéo dans cette playlist.</Alert>
        )}
      </div>
    </div>
  );
}
