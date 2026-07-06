"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PlaylistSidebar from "@/src/components/collection/PlaylistSidebar/PlaylistSidebar";
import FavoritesSidebar from "@/src/components/collection/FavoritesSidebar/FavoritesSidebar";
import { Alert, Button, Input, VariantType } from "@openfun/cunningham-react";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import VideoPlayer from "@/src/components/video/player/VideoPlayer";
import Comments from "@/src/components/Comments/Comments";
import { useVideos } from "@/src/hooks/useVideos";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useAuth } from "@/src/context/AuthProvider";
import Divider from "@mui/material/Divider";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SchoolIcon from "@mui/icons-material/School";
import MonitorIcon from "@mui/icons-material/Monitor";
import PieChartIcon from "@mui/icons-material/PieChart";
import {
  formatTime,
  formatDateWithTime,
  timeAgo,
  secondToMinute,
} from "@/src/constants/date";
import { Chip } from "@mui/material";
import { getCursusLabel } from "@/src/constants/cursus";
import { useUsers } from "@/src/hooks/useUsers";
import { getUserDisplayName } from "@/src/constants/user";
import { getLanguageLabel } from "@/src/constants/language";
import { requestJson } from "@/src/utils/requestJson";
import type { User, Video } from "@/src/types";
import DownloadIcon from "@mui/icons-material/Download";
import UpdateIcon from "@mui/icons-material/Update";
import styles from "./styles.module.css";
import BackButton from "@/src/components/BackButton/BackButton";
import { useChannel } from "@/src/hooks/useChannel";
import { useVideoPermissions } from "@/src/hooks/useVideoPermission";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import PlaylistActionMenu from "./playlistActionMenu";
import { usePlaylist } from "@/src/hooks/usePlaylist";
import { useFavorites } from "@/src/hooks/useFavorites";

export const breadcrumbLabel = "Video";

const getDownloadFilename = (
  contentDisposition: string | null,
  videoSlug: string,
) => {
  const utf8Match = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }
  const asciiMatch = contentDisposition?.match(/filename="?([^"]+)"?/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }
  return `${videoSlug}.mp4`;
};

export default function Video() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const searchParams = useSearchParams();
  const playlistSlug = searchParams.get("playlist");
  const favoritesParam = searchParams.get("favorites");
  const showFavoritesSidebar = favoritesParam === "1";

  const { fetchOne, video, useVideoLoading, useVideoError, unlockVideo } =
    useVideos();
  const time = secondToMinute(video?.duration || 0);
  const { accessToken, refresh, user } = useAuth();
  const authRequired =
    Boolean(video?.is_auth_required) || useVideoError === "AUTH_REQUIRED";
  const { isAuthenticated } = useRequireAuth("/login", authRequired);
  const { isOwnerOrCoOwner } = useVideoPermissions(video);

  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { fetchUser } = useUsers();
  const { fetchOne: fetchChannel, channel: videoChannel } = useChannel();
  const {
    playlist,
    playlists,
    usePlaylistLoading,
    usePlaylistError,
    fetchOne: fetchPlaylist,
    fetchAll: fetchAllPlaylist,
  } = usePlaylist();

  const [coOwnersUsers, setCoOwnersUsers] = useState<User[]>([]);
  const [password, setPassword] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const myPlaylists = useMemo(
    () =>
      user ? playlists.filter((playlist) => playlist.owner === user.id) : [],
    [playlists, user],
  );

  const { favorites, fetchAll: fetchAllFavorites } = useFavorites();

  const favoriteVideos: Video[] = useMemo(() => {
    if (!favorites || favorites.length === 0) {
      return [];
    }

    const byId = new Map<number, Video>();

    favorites.forEach((favorite) => {
      if (favorite.video_details && !byId.has(favorite.video_details.id)) {
        byId.set(favorite.video_details.id, favorite.video_details);
      }
    });

    return Array.from(byId.values());
  }, [favorites]);

  const nextVideoSlug = useMemo(() => {
    // Cas playlist : on se base sur playlist.items (déjà ordonnés par position)
    if (playlistSlug && playlist?.items && playlist.items.length > 0) {
      const items = [...playlist.items].filter((item) => item.video != null);

      const currentIndex = items.findIndex(
        (item) => item.video?.slug === video?.slug,
      );

      if (currentIndex !== -1 && currentIndex < items.length - 1) {
        const nextItem = items[currentIndex + 1];
        return nextItem.video?.slug ?? null;
      }
    }

    if (showFavoritesSidebar && favoriteVideos.length > 0 && video) {
      const currentIndex = favoriteVideos.findIndex(
        (favVideo) => favVideo.slug === video.slug,
      );

      if (currentIndex !== -1 && currentIndex < favoriteVideos.length - 1) {
        return favoriteVideos[currentIndex + 1].slug;
      }
    }

    return null;
  }, [playlistSlug, playlist, favoriteVideos, showFavoritesSidebar, video]);

  const handleVideoEnded = () => {
    if (!nextVideoSlug) {
      return;
    }

    if (playlistSlug) {
      // On reste dans le contexte de la même playlist
      router.push(`/video/${nextVideoSlug}?playlist=${playlistSlug}`);
      return;
    }

    if (showFavoritesSidebar) {
      // On reste dans le contexte favoris
      router.push(`/video/${nextVideoSlug}?favorites=1`);
    }
  };

  /* ------------------------------------------------------------------
   *  Récuperation de la vidéo et des co owners
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!slug) return;
    fetchOne(slug);
  }, [slug, fetchOne]);

  useEffect(() => {
    if (!playlistSlug) return;
    fetchPlaylist(playlistSlug);
  }, [playlistSlug, fetchPlaylist]);

  useEffect(() => {
    if (!video || video.status !== "RE") return;
    if (video.is_auth_required) return;
    if (video.has_password) return;
    unlockVideo(video.slug);
  }, [video, unlockVideo]);

  useEffect(() => {
    if (video && isAuthenticated) {
      fetchUser(video.owner_id);
      fetchAllPlaylist();
      fetchAllFavorites();
    }
  }, [video, isAuthenticated, fetchUser, fetchAllPlaylist, fetchAllFavorites]);

  useEffect(() => {
    if (isAuthenticated) {
      const loadCoOwners = async () => {
        if (!video?.co_owners?.length) {
          setCoOwnersUsers([]);
          return;
        }
        try {
          const responses = await Promise.all(
            video.co_owners.map((id) =>
              authFetch(getRoutes().user.get(id), {
                accessToken,
                onRefresh: refresh,
              }),
            ),
          );
          const coOwners = await Promise.all(
            responses.map((response) => requestJson<User>(response)),
          );
          setCoOwnersUsers(coOwners);
        } catch (error) {
          console.error(
            "Erreur lors du chargement des co‑propriétaires",
            error,
          );
          setCoOwnersUsers([]);
        }
      };
      loadCoOwners();
    }
  }, [video?.co_owners, isAuthenticated, accessToken, refresh]);

  const handleUnlock = async () => {
    if (!video || isUnlocking) return;
    setUnlockError(null);
    setIsUnlocking(true);

    try {
      const payload = password.trim()
        ? { password: password.trim() }
        : undefined;
      const unlocked = await unlockVideo(video.slug, payload);
      if (!unlocked) {
        setUnlockError("Impossible de déverrouiller cette vidéo.");
        setIsUnlocked(false);
      } else {
        setIsUnlocked(true);
      }
    } catch (error) {
      setUnlockError(
        error instanceof Error
          ? error.message
          : "Impossible de déverrouiller cette vidéo.",
      );
      setIsUnlocked(false);
    } finally {
      setIsUnlocking(false);
    }
  };

  /* ------------------------------------------------------------------
   * Gestion du téléchargement de la vidéo
   * ------------------------------------------------------------------ */
  const handleDownload = async () => {
    if (!video || isDownloading) return;
    setDownloadError(null);
    setIsDownloading(true);
    try {
      const response = await authFetch(getRoutes().video.stream(video.slug), {
        accessToken,
        onRefresh: refresh,
      });
      if (!response.ok) {
        throw new Error("Impossible de télécharger cette vidéo.");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = getDownloadFilename(
        response.headers.get("content-disposition"),
        video.slug,
      );
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Impossible de télécharger cette vidéo.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  /* ------------------------------------------------------------------
   * Retour d’erreur / état de chargement
   * ------------------------------------------------------------------ */
  if (!slug) {
    return (
      <Alert canClose type={VariantType.ERROR}>
        Vidéo introuvable.
      </Alert>
    );
  }

  if (useVideoLoading && !video) {
    return <CenteredLoader />;
  }

  if (useVideoError === "AUTH_REQUIRED") {
    return <CenteredLoader />;
  }

  if (!useVideoError && !video) {
    return <CenteredLoader />;
  }

  if (useVideoError || !video) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Alert canClose type={VariantType.ERROR}>
          {useVideoError ?? "Impossible de charger cette vidéo."}
        </Alert>
      </div>
    );
  }

  const needsPassword =
    video.status === "RE" && video.has_password && !isUnlocked;

  if (needsPassword) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Alert type={VariantType.WARNING}>
          Cette vidéo est protégée par un mot de passe.
        </Alert>
        {unlockError && (
          <Alert canClose type={VariantType.ERROR}>
            {unlockError}
          </Alert>
        )}
        <div className={styles.unlock_form}>
          <Input
            label="Mot de passe"
            required={true}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            color="brand"
            type="button"
            onClick={handleUnlock}
            disabled={isUnlocking || password.trim().length === 0}
          >
            {isUnlocking ? "Déverrouillage..." : "Déverrouiller la vidéo"}
          </Button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------
   * Rendu principal
   * ------------------------------------------------------------------ */
  return (
    <div>
      <BackButton label="Retour" />
      <div className={styles.main_video_content}>
        {/* --------------------------------------------------------------
         *  Colonne principale
         * ------------------------------------------------------------ */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            padding: "10px",
            minWidth: "70%",
          }}
        >
          <VideoPlayer
            video={video}
            streamUrl={video.video_url ?? getRoutes().video.stream(video.slug)}
            autoPlay={Boolean(playlistSlug || showFavoritesSidebar)}
            onEnded={handleVideoEnded}
          />

          <h1>{video.title}</h1>

          {downloadError && (
            <Alert canClose type={VariantType.ERROR}>
              {downloadError}
            </Alert>
          )}

          {/* -------------------- Infos vidéo -------------------- */}
          <div className={styles.video_infos}>
            <div className={styles.video_infos_header}>
              <p className={styles.video_infos_header_time}>
                <span className="material-icons" aria-hidden="true">
                  access_time
                </span>
                {formatTime(time)}
              </p>
              <p>{timeAgo(video.created_at)}</p>
            </div>

            <div className={styles.video_infos_header_buttons}>
              {video.allow_downloading && (
                <Button
                  color="brand"
                  size="small"
                  variant="bordered"
                  icon={<DownloadIcon aria-hidden="true" />}
                  iconPosition="right"
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Téléchargement…" : "Télécharger la vidéo"}
                </Button>
              )}
              {isOwnerOrCoOwner && (
                <Button
                  onClick={() => router.push(`/video/edit/${video.slug}`)}
                  size="small"
                  color="brand"
                  variant="primary"
                  type="button"
                >
                  Éditer la vidéo
                </Button>
              )}
              {myPlaylists && user && (
                <PlaylistActionMenu
                  playlists={myPlaylists}
                  videoId={video.id}
                />
              )}
            </div>
          </div>

          {/* Description */}
          {video.description && (
            <div className={styles.video_infos_description}>
              <p>{video.description}</p>
            </div>
          )}

          <Divider />

          <dl className={styles.video_infos_details}>
            <div>
              <dt>Chaîne :</dt>
              <dd>{video.channel ? video.channel : "Aucune"}</dd>
            </div>

            <div>
              <dt>Ajouté par :</dt>
              <dd>
                {video.owner_last_name && video.owner_first_name != ""
                  ? video.owner_last_name + " " + video.owner_first_name
                  : video.owner}
              </dd>
            </div>

            {coOwnersUsers.length > 0 && (
              <div>
                <dt>Co‑propriétaire{coOwnersUsers.length > 1 ? "s" : ""} :</dt>
                <dd>
                  {coOwnersUsers.map((u) => getUserDisplayName(u)).join(", ")}
                </dd>
              </div>
            )}

            <div>
              <dt>Langue principale :</dt>
              <dd>{getLanguageLabel(video.language)}</dd>
            </div>

            {video.tags != null && video.tags?.length > 0 && (
              <div className={styles.video_infos_details_tags}>
                <dt>Mots‑clés :</dt>
                <dd>
                  {video.tags.map((label) => (
                    <Chip key={label} label={label} sx={{ margin: "0 2px" }} />
                  ))}
                </dd>
              </div>
            )}

            <div className={styles.video_infos_details_status}>
              <dt>Statut de la vidéo:</dt>
              <dd>{video.status_label}</dd>
            </div>
            <div className={styles.video_infos_details_update}>
              <dt>Mis à jour le</dt>
              <dd>{formatDateWithTime(video.updated_at)}</dd>
            </div>
          </dl>

          {/* Commentaires */}
          {video.disable_comment ? (
            <Alert type={VariantType.INFO}>
              Les commentaires sont désactivés
            </Alert>
          ) : (
            <Comments videoSlug={video.slug} />
          )}
        </section>

        {/* --------------------------------------------------------------
         *  Colonne latérale
         * ------------------------------------------------------------ */}
        <aside
          className={styles.sidebar}
          aria-label="Informations complémentaires"
        >
          {/* Bloc playlist  */}
          {playlistSlug && (
            <>
              {usePlaylistLoading && !playlist && <CenteredLoader />}

              {usePlaylistError && (
                <Alert canClose type={VariantType.ERROR}>
                  {usePlaylistError}
                </Alert>
              )}

              {playlist && !usePlaylistError && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <PlaylistSidebar
                    playlist={playlist}
                    currentVideoSlug={video.slug}
                  />
                </div>
              )}
            </>
          )}
          {/* Bloc favoris  */}
          {showFavoritesSidebar && favoriteVideos.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <FavoritesSidebar
                videos={favoriteVideos}
                currentVideoSlug={video.slug}
              />
            </div>
          )}

          {/* Section "À propos"*/}
          <section className={styles.video_infos_block_right}>
            <h2 className={styles.video_infos_block_right_title}>À propos</h2>
            <Divider />

            <h4>
              <LibraryBooksIcon fontSize="small" aria-hidden="true" /> Type
            </h4>
            <p>{video.type_name}</p>

            <h4>
              <SchoolIcon fontSize="small" aria-hidden="true" /> Discipline
            </h4>
            <ul>
              {video.discipline_details?.length ? (
                video.discipline_details.map((d) => (
                  <li key={d.id}>{d.title}</li>
                ))
              ) : (
                <li>Aucune</li>
              )}
            </ul>

            <h4>
              <MonitorIcon fontSize="small" aria-hidden="true" /> Licence
            </h4>
            <p>{video.license ?? "Aucune"}</p>

            <h4>
              <PieChartIcon fontSize="small" aria-hidden="true" /> Cursus
            </h4>
            <p>{getCursusLabel(video.cursus)}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
