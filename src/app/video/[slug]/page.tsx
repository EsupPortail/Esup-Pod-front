"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PlaylistSidebar from "@/src/components/collection/PlaylistSidebar/PlaylistSidebar";
import FavoritesSidebar from "@/src/components/collection/FavoritesSidebar/FavoritesSidebar";
import { Alert, Button, Input, VariantType } from "@openfun/cunningham-react";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import VideoPlayer from "@/src/components/video/player/VideoPlayer";
import Comments from "@/src/components/Comments/Comments";
import { useVideo, useUnlockVideo } from "@/src/hooks/useVideos";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useAuth } from "@/src/context/AuthProvider";
import Divider from "@mui/material/Divider";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SchoolIcon from "@mui/icons-material/School";
import MonitorIcon from "@mui/icons-material/Monitor";
import PieChartIcon from "@mui/icons-material/PieChart";
import {
  formatDateWithTime,
  formatDateOnly,
  formatTime,
  secondToMinute,
} from "@/src/constants/date";
import PlaylistActionMenu from "./playlistActionMenu";
import { Chip } from "@mui/material";
import { getCursusLabel } from "@/src/constants/cursus";
import { useUsers } from "@/src/hooks/useUsers";
import {
  getUserDisplayName,
  getVideoOwnerDisplayName,
} from "@/src/constants/user";
import { getLanguageLabel } from "@/src/constants/language";
import { requestJson } from "@/src/utils/requestJson";
import type { User, Video } from "@/src/types";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import styles from "./styles.module.css";
import BackButton from "@/src/components/BackButton/BackButton";
import VideoShareMenu from "@/src/components/video/VideoShareMenu";
import VideoDownloadMenu from "@/src/components/video/VideoDownloadMenu";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useVideoPermissions } from "@/src/hooks/useVideoPermission";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";

import { usePlaylist } from "@/src/hooks/usePlaylist";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import { useTranslation } from "@/src/hooks/useTranslation";

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

/** Loading skeleton — defined at module level to avoid recreation on every render */
function VideoPageSkeleton() {
  return (
    <div>
      <div
        style={{
          width: 100,
          height: 40,
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          marginBottom: 20,
        }}
      />
      <div className={styles["main-video-content"]}>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            padding: "10px",
            minWidth: "70%",
          }}
        >
          <div
            className="skeleton-block"
            style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 8 }}
          />
          <div
            className="skeleton-block"
            style={{ width: "60%", height: 32, borderRadius: 4 }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              className="skeleton-block"
              style={{ width: "20%", height: 24, borderRadius: 4 }}
            />
            <div
              className="skeleton-block"
              style={{ width: "30%", height: 32, borderRadius: 4 }}
            />
          </div>
        </section>
        <aside className={styles["sidebar"]}>
          <div
            className="skeleton-block"
            style={{ width: "100%", height: 300, borderRadius: 8 }}
          />
        </aside>
      </div>
    </div>
  );
}

export default function Video() {
  const router = useRouter();
  const params = useParams();
  const { t, locale } = useTranslation();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const searchParams = useSearchParams();
  const playlistSlug = searchParams.get("playlist");
  const favoritesParam = searchParams.get("favorites");
  const showFavoritesSidebar = favoritesParam === "1";
  const { config } = useAppConfig();

  const {
    data: video,
    isLoading: useVideoLoading,
    error,
  } = useVideo(slug ?? "");
  const useVideoError = error?.message ?? null;
  const { mutateAsync: unlockVideoMutation } = useUnlockVideo();
  const unlockVideo = useCallback(
    async (
      videoSlug: string,
      payload?: { password?: string; hash?: string },
    ) => {
      await unlockVideoMutation({ slug: videoSlug, payload });
      return true;
    },
    [unlockVideoMutation],
  );
  const time = secondToMinute(video?.duration || 0);
  const { accessToken, refresh, user } = useAuth();
  const authRequired =
    Boolean(video?.is_auth_required) || useVideoError === "AUTH_REQUIRED";
  const { isAuthenticated } = useRequireAuth("/login", authRequired);
  const { isOwnerOrCoOwner } = useVideoPermissions(video ?? null);

  const restrictEditToStaff = config?.video?.restrict_edit_to_staff === true;
  const canEdit = !restrictEditToStaff || user?.is_staff === true;

  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { fetchUser } = useUsers();

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
  const [streamToken, setStreamToken] = useState<{
    slug: string;
    token: string;
  } | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [mobileTab, setMobileTab] = useState("description");

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const resolvedStreamUrl = useMemo(() => {
    if (!video) return "";
    if (video.video_url) return video.video_url;
    const baseStreamUrl = getRoutes().video.stream(video.slug);
    if (streamToken?.slug === video.slug) {
      return `${baseStreamUrl}?token=${streamToken.token}`;
    }
    return "";
  }, [video, streamToken]);

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
    if (video?.title) {
      document.title = `${video.title} | Esup-Pod`;
    }
  }, [video?.title]);

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
          console.error("Error loading co-owners", error);
          setCoOwnersUsers([]);
        }
      };
      loadCoOwners();
    }
  }, [video?.co_owners, isAuthenticated, accessToken, refresh]);

  useEffect(() => {
    if (!video) return;
    if (video.video_url) {
      return;
    }

    const fetchStreamToken = async () => {
      try {
        const response = await authFetch(
          `${getRoutes().video.get(video.slug)}create-stream-token/`,
          {
            method: "POST",
            accessToken,
            onRefresh: refresh,
          },
        );
        if (response.ok) {
          const data = await requestJson<{ stream_token: string }>(response);
          setStreamToken({ slug: video.slug, token: data.stream_token });
        }
      } catch (err) {
        console.error("Failed to fetch stream token", err);
      }
    };

    fetchStreamToken();
  }, [video, accessToken, refresh]);

  const handleUnlock = async () => {
    if (!video || isUnlocking) return;
    setUnlockError(null);
    setIsUnlocking(true);

    try {
      const unlockError = "Unable to unlock this video.";
      const payload = password.trim()
        ? { password: password.trim() }
        : undefined;
      const unlocked = await unlockVideo(video.slug, payload);
      if (!unlocked) {
        setUnlockError(unlockError);
        setIsUnlocked(false);
      } else {
        setIsUnlocked(true);
      }
    } catch (error) {
      setUnlockError(error instanceof Error ? error.message : unlockError);
      setIsUnlocked(false);
    } finally {
      setIsUnlocking(false);
    }
  };

  /* ------------------------------------------------------------------
   * Gestion du téléchargement de la vidéo
   * ------------------------------------------------------------------ */
  const handleDownload = async (targetUrl?: string, resolution?: string) => {
    if (!video || isDownloading) return;
    setDownloadError(null);
    setIsDownloading(true);
    try {
      const urlToFetch = targetUrl || getRoutes().video.stream(video.slug);
      const response = await authFetch(urlToFetch, {
        accessToken,
        onRefresh: refresh,
      });
      if (!response.ok) {
        throw new Error(`${t("videoPlayer.unableToDownload")}`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ext =
        resolution && resolution !== "Original" ? `_${resolution}.mp4` : `.mp4`;
      const baseFilename = getDownloadFilename(
        response.headers.get("content-disposition"),
        video.slug,
      );
      const finalFilename =
        resolution && resolution !== "Original"
          ? baseFilename.replace(/\.mp4$/i, "") + ext
          : baseFilename;

      link.href = downloadUrl;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : `${t("videoPlayer.unableToDownload")}`,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  /* ------------------------------------------------------------------
   * // Error feedback / loading state
   * ------------------------------------------------------------------ */
  if (!slug) {
    return (
      <Alert canClose type={VariantType.ERROR}>
        {t("videoPage.notFound")}
      </Alert>
    );
  }

  const needsPassword = video
    ? video.status === "RE" && video.has_password && !isUnlocked
    : false;

  if (useVideoLoading || (!video && !useVideoError)) {
    return <VideoPageSkeleton />;
  }

  if (useVideoError === "AUTH_REQUIRED") {
    return <VideoPageSkeleton />;
  }

  if (useVideoError || !video) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Alert canClose type={VariantType.ERROR}>
          {useVideoError ?? t("videoPage.unableToLoad")}
        </Alert>
      </div>
    );
  }

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
        <BackButton />
        <Alert type={VariantType.WARNING}>
          {t("videoPage.protectedByPassword")}
        </Alert>
        {unlockError && (
          <Alert canClose type={VariantType.ERROR}>
            {unlockError}
          </Alert>
        )}
        <div className={styles["unlock-form"]}>
          <Input
            label={t("videoPage.password")}
            required={true}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            color="brand"
            type="button"
            onClick={handleUnlock}
            disabled={isUnlocking || password.trim().length === 0}
          >
            {isUnlocking
              ? `${t("videoPage.unlocking")}`
              : `${t("videoPage.unlock")}`}
          </Button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------
   * Main render
   * ------------------------------------------------------------------ */
  return (
    <div>
      <BackButton label={t("videoPage.back")} />
      <div className={styles["main-video-content"]}>
        {/* --------------------------------------------------------------
         *  Main column
         * ------------------------------------------------------------ */}
        <section className={styles["video-main-section"]}>
          <div className={styles["video-wrapper"]}>
            {resolvedStreamUrl ? (
              <VideoPlayer
                video={video}
                streamUrl={resolvedStreamUrl}
                autoPlay={Boolean(playlistSlug || showFavoritesSidebar)}
                onPlay={() => {
                  authFetch(getRoutes().video.registerView(video.slug), {
                    method: "POST",
                    accessToken,
                    onRefresh: refresh,
                  }).catch(() => {
                    console.error("Error recording view");
                  });
                }}
                onEnded={handleVideoEnded}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <CenteredLoader />
              </div>
            )}
          </div>
          <div className={styles["video-title-row"]}>
            <h1>{video.title}</h1>
            {config?.video?.show_views !== false && video.views != null && (
              <span className={styles["video-views"]}>
                {video.views} {t("videoPage.views")}
              </span>
            )}
          </div>

          {downloadError && (
            <Alert canClose type={VariantType.ERROR}>
              {downloadError}
            </Alert>
          )}

          {/* -------------------- video infos -------------------- */}
          <div className={styles["video-infos"]}>
            <div className={styles["video-infos-header"]}>
              <div className={styles["video-infos-header-time"]}>
                <span
                  className="material-icons"
                  aria-hidden="true"
                  style={{ fontSize: "18px" }}
                >
                  calendar_today
                </span>
                {formatDateOnly(video.created_at, locale)}
              </div>
              <div className={styles["video-infos-header-time"]}>
                <span
                  className="material-icons"
                  aria-hidden="true"
                  style={{ fontSize: "18px" }}
                >
                  access_time
                </span>
                {formatTime(time)}
              </div>

              <div className={styles["video-actions-row"]}>
                {config?.video?.hide_share !== true && (
                  <VideoShareMenu
                    video={video}
                    className={styles["action-pill"]}
                  />
                )}
                {video.allow_downloading && (
                  <VideoDownloadMenu
                    video={video}
                    className={styles["action-pill"]}
                    onDownloadStreamUrl={(url, res) => handleDownload(url, res)}
                  />
                )}
                {user && config?.collection?.use_playlists !== false && (
                  <PlaylistActionMenu
                    playlists={myPlaylists}
                    videoId={video.id}
                  />
                )}
                <button
                  className={`${styles["action-pill"]} ${styles["report-btn"]}`}
                  disabled
                  title={t("common.commingSoon")}
                >
                  <FlagIcon fontSize="small" /> {t("videoPage.report")}
                </button>
                {isOwnerOrCoOwner && canEdit && (
                  <Button
                    onClick={() => router.push(`/video/edit/${video.slug}`)}
                    size="small"
                    color="brand"
                    variant="primary"
                    icon={<EditIcon fontSize="small" />}
                  >
                    {t("videoPage.editVideo")}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {isMobile ? (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={mobileTab}
                  onChange={(e, val) => setMobileTab(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab
                    label={t("videoEdit.descriptionLabel")}
                    value="description"
                    sx={{ textTransform: "none" }}
                  />
                  {config?.video?.active_video_comment !== false && (
                    <Tab
                      label={t("comments.title")}
                      value="commentaires"
                      sx={{ textTransform: "none" }}
                    />
                  )}
                  <Tab
                    label={t("videoPage.about")}
                    value="apropos"
                    sx={{ textTransform: "none" }}
                  />
                  {video.documents && video.documents.length > 0 && (
                    <Tab
                      label={t("videoPage.resources")}
                      value="ressources"
                      sx={{ textTransform: "none" }}
                    />
                  )}
                </Tabs>
              </Box>
              <Box sx={{ py: 2 }}>
                {mobileTab === "description" && (
                  <>
                    {video.description && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          className={`${styles["video-infos-description"]} ${!isDescriptionExpanded ? styles.collapsed : ""}`}
                        >
                          <p style={{ margin: 0 }}>{video.description}</p>
                          <p
                            style={{
                              margin: 0,
                              marginTop: 8,
                              color: "var(--c--globals--colors--gray-500)",
                            }}
                          >
                            {t("videoPage.updatedAt")}{" "}
                            {formatDateWithTime(video.updated_at, locale)}
                          </p>
                        </div>
                        <button
                          className={styles["read-more-btn"]}
                          onClick={() =>
                            setIsDescriptionExpanded(!isDescriptionExpanded)
                          }
                        >
                          {isDescriptionExpanded
                            ? t("videoPage.seeLess")
                            : t("videoPage.seeMore")}
                          {isDescriptionExpanded ? (
                            <KeyboardArrowUpIcon
                              fontSize="inherit"
                              style={{ verticalAlign: "middle" }}
                            />
                          ) : (
                            <KeyboardArrowDownIcon
                              fontSize="inherit"
                              style={{ verticalAlign: "middle" }}
                            />
                          )}
                        </button>
                      </div>
                    )}
                    <div className={styles["video-infos-details"]}>
                      <div>
                        <dt>{t("common.channel")}</dt>
                        <dd>
                          {video.channel ? video.channel : t("videoPage.none")}
                        </dd>
                      </div>
                      <div>
                        <dt>{t("videoPage.creator")}</dt>
                        <dd>
                          {getVideoOwnerDisplayName(
                            video,
                            config?.authentication,
                            true,
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt>{t("videoEdit.mainLanguageLabel")}</dt>
                        <dd>{getLanguageLabel(video.language)}</dd>
                      </div>
                      {video.tags != null && video.tags?.length > 0 && (
                        <div className={styles["video-infos-details-tags"]}>
                          <dt>{t("videoPage.keywords")}</dt>
                          <dd>
                            {video.tags.map((label) => (
                              <Chip key={label} label={label} size="small" />
                            ))}
                          </dd>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {mobileTab === "commentaires" &&
                  config?.video?.active_video_comment !== false &&
                  (video.disable_comment ? (
                    <Alert type={VariantType.INFO}>
                      {t("comments.disabled")}
                    </Alert>
                  ) : (
                    <Comments videoSlug={video.slug} />
                  ))}
                {mobileTab === "apropos" && (
                  <section className={styles["sidebar-card"]}>
                    <h2 className={styles["sidebar-card-title"]}>
                      {t("videoPage.about")}
                    </h2>
                    <Divider sx={{ mb: 2 }} />
                    <div className={styles["sidebar-list-item"]}>
                      <h4>
                        <LibraryBooksIcon fontSize="small" />{" "}
                        {t("videoPage.type")}
                      </h4>
                      <p className={styles["sidebar-blue-text"]}>
                        {video.type_name || `${t("videoPage.none")}`}
                      </p>
                    </div>
                    <div className={styles["sidebar-list-item"]}>
                      <h4>
                        <PieChartIcon fontSize="small" />{" "}
                        {t("videoPage.disciplines")}
                      </h4>
                      <ul>
                        {video.discipline_details?.length ? (
                          video.discipline_details.map((d) => (
                            <li
                              key={d.id}
                              className={styles["sidebar-blue-text"]}
                            >
                              {d.title}
                            </li>
                          ))
                        ) : (
                          <li className={styles["sidebar-blue-text"]}>
                            {t("videoPage.none")}
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className={styles["sidebar-list-item"]}>
                      <h4>
                        <SchoolIcon fontSize="small" />{" "}
                        {t("videoPage.contributors")}
                      </h4>
                      <p className={styles["sidebar-blue-text"]}>
                        {getVideoOwnerDisplayName(
                          video,
                          config?.authentication,
                          true,
                        )}
                        {coOwnersUsers.length > 0 && <br />}
                        {coOwnersUsers.length > 0 &&
                          coOwnersUsers
                            .map((u) =>
                              getUserDisplayName(
                                u,
                                config?.authentication,
                                true,
                              ),
                            )
                            .join(", ")}
                      </p>
                    </div>
                  </section>
                )}
                {mobileTab === "ressources" &&
                  video.documents &&
                  video.documents.length > 0 && (
                    <section className={styles["sidebar-card"]}>
                      <h2 className={styles["sidebar-card-title"]}>
                        {t("videoPage.resources")}
                      </h2>
                      <div>
                        {video.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles["document-item"]}
                          >
                            <InsertDriveFileIcon
                              className={styles["document-icon"]}
                            />
                            <div className={styles["document-info"]}>
                              <span className={styles["document-title"]}>
                                {doc.title}
                              </span>
                              <span className={styles["document-date"]}>
                                {formatDateWithTime(doc.created_at, locale)}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </section>
                  )}
              </Box>
            </Box>
          ) : (
            <>
              <div className={styles["video-infos-details"]}>
                <div>
                  <dt>{t("videoPage.channel")}</dt>
                  <dd>{video.channel ? video.channel : t("videoPage.none")}</dd>
                </div>
                <div>
                  <dt>{t("videoPage.creator")}</dt>
                  <dd>
                    {getVideoOwnerDisplayName(
                      video,
                      config?.authentication,
                      true,
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{t("videoPage.mainLanguage")}</dt>
                  <dd>{getLanguageLabel(video.language)}</dd>
                </div>
                {video.tags != null && video.tags?.length > 0 && (
                  <div className={styles["video-infos-details-tags"]}>
                    <dt>{t("videoPage.keywords")}</dt>
                    <dd>
                      {video.tags.map((label) => (
                        <Chip key={label} label={label} size="small" />
                      ))}
                    </dd>
                  </div>
                )}
              </div>

              {/* Description */}
              {video.description && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    className={`${styles["video-infos-description"]} ${!isDescriptionExpanded ? styles.collapsed : ""}`}
                  >
                    <p style={{ margin: 0 }}>{video.description}</p>
                    <p
                      style={{
                        margin: 0,
                        marginTop: 8,
                        color: "var(--c--globals--colors--gray-500)",
                      }}
                    >
                      {t("videoPage.updatedAt")}{" "}
                      {formatDateWithTime(video.updated_at, locale)}
                    </p>
                  </div>
                  <button
                    className={styles["read-more-btn"]}
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                  >
                    {isDescriptionExpanded
                      ? t("videoPage.seeLess")
                      : t("videoPage.seeMore")}
                    {isDescriptionExpanded ? (
                      <KeyboardArrowUpIcon
                        fontSize="inherit"
                        style={{ verticalAlign: "middle" }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        fontSize="inherit"
                        style={{ verticalAlign: "middle" }}
                      />
                    )}
                  </button>
                </div>
              )}

              {/* Comments */}
              {config?.video?.active_video_comment !== false &&
                (video.disable_comment ? (
                  <Alert type={VariantType.INFO}>
                    {t("comments.disabled")}
                  </Alert>
                ) : (
                  <Comments videoSlug={video.slug} />
                ))}
            </>
          )}
        </section>
        {!isMobile && (
          <aside className={styles.sidebar} aria-label={t("videoPage.about")}>
            {/* Playlist Block  */}
            {playlistSlug && config?.collection?.use_playlists !== false && (
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
            {/* Favorites Block */}
            {showFavoritesSidebar &&
              favoriteVideos.length > 0 &&
              config?.collection?.use_favorites !== false && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <FavoritesSidebar
                    videos={favoriteVideos}
                    currentVideoSlug={video.slug}
                  />
                </div>
              )}

            {/* About section */}
            <section className={styles["sidebar-card"]}>
              <h2 className={styles["sidebar-card-title"]}>
                {t("videoPage.about")}
              </h2>
              <Divider sx={{ mb: 2 }} />

              <div className={styles["sidebar-list-item"]}>
                <h3>
                  <LibraryBooksIcon fontSize="small" /> {t("videoPage.type")}
                </h3>
                <p className={styles["sidebar-blue-text"]}>
                  {video.type_name || t("videoPage.none")}
                </p>
              </div>

              {video.date_of_event && (
                <div className={styles["sidebar-list-item"]}>
                  <h3>
                    <PieChartIcon fontSize="small" aria-hidden="true" />{" "}
                    {t("videoPage.eventDate")}
                  </h3>
                  <p className={styles["sidebar-blue-text"]}>
                    {formatDateOnly(video.date_of_event, locale)}
                  </p>
                </div>
              )}

              <div className={styles["sidebar-list-item"]}>
                <h3>
                  <PieChartIcon fontSize="small" aria-hidden="true" />{" "}
                  {t("videoPage.discipline")}
                </h3>
                <ul>
                  {video.discipline_details?.length ? (
                    video.discipline_details.map((d) => (
                      <li key={d.id} className={styles["sidebar-blue-text"]}>
                        {d.title}
                      </li>
                    ))
                  ) : (
                    <li className={styles["sidebar-blue-text"]}>
                      {t("videoPage.none")}
                    </li>
                  )}
                </ul>
              </div>

              <div className={styles["sidebar-list-item"]}>
                <h4>
                  <SchoolIcon fontSize="small" /> {t("videoPage.contributors")}
                </h4>
                <p className={styles["sidebar-blue-text"]}>
                  {getVideoOwnerDisplayName(
                    video,
                    config?.authentication,
                    true,
                  )}
                  {coOwnersUsers.length > 0 && <br />}
                  {coOwnersUsers.length > 0 &&
                    coOwnersUsers
                      .map((u) =>
                        getUserDisplayName(u, config?.authentication, true),
                      )
                      .join(", ")}
                </p>
              </div>

              <div className={styles["sidebar-list-item"]}>
                <h3>
                  <MonitorIcon fontSize="small" aria-hidden="true" />{" "}
                  {t("videoPage.license")}
                </h3>
                <p className={styles["sidebar-blue-text"]}>
                  {video.license ?? t("videoPage.none")}
                </p>
              </div>

              <div className={styles["sidebar-list-item"]}>
                <h3>
                  <PieChartIcon fontSize="small" aria-hidden="true" />{" "}
                  {t("videoPage.cursus")}
                </h3>
                <p className={styles["sidebar-blue-text"]}>
                  {getCursusLabel(video.cursus, t)}
                </p>
              </div>
            </section>

            {/* Resources block */}
            {video.documents && video.documents.length > 0 && (
              <section className={styles["sidebar-card"]}>
                <h2 className={styles["sidebar-card-title"]}>
                  {t("videoPage.resources")}
                </h2>
                <div>
                  {video.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles["document-item"]}
                    >
                      <InsertDriveFileIcon
                        className={styles["document-icon"]}
                        aria-hidden="true"
                      />
                      <div className={styles["document-info"]}>
                        <span className={styles["document-title"]}>
                          {doc.title}
                        </span>
                        <span className={styles["document-date"]}>
                          {formatDateWithTime(doc.created_at, locale)}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </aside>
        )}
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
