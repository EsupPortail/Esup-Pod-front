"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Alert, Button, Loader } from "@openfun/cunningham-react";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import VideoPlayer from "@/src/components/video/player/VideoPlayer";
import Comments from "@/src/components/Comments/Comments";
import { useVideos } from "@/src/hooks/useVideos";
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
import type { User } from "@/src/types";
import DownloadIcon from "@mui/icons-material/Download";
import UpdateIcon from "@mui/icons-material/Update";
import styles from "./styles.module.css";
import BackButton from "@/src/components/BackButton/BackButton";

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

  const { fetchOne, video, useVideoLoading, useVideoError } = useVideos();
  const time = secondToMinute(video?.duration || 0);
  const { user, accessToken, refresh } = useAuth();
  const isOwner = user?.id != null && video?.owner_id === user?.id;

  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { fetchUser, user: videoUser } = useUsers();
  const [coOwnersUsers, setCoOwnersUsers] = useState<User[]>([]);

  /* ------------------------------------------------------------------
   *  Récuperation de la vidéo et des co owners
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!slug) return;
    fetchOne(slug);
  }, [slug, fetchOne]);

  useEffect(() => {
    if (video && user) fetchUser(video.owner_id);
  }, [video, fetchUser]);

  useEffect(() => {
    if (user) {
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
  }, [video?.co_owners, accessToken, refresh]);

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
      <Alert canClose type="error" role="alert">
        Vidéo introuvable.
      </Alert>
    );
  }

  if (useVideoLoading && !video) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  if (useVideoError || !video) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Alert canClose type="error" role="alert">
          {useVideoError ?? "Impossible de charger cette vidéo."}
        </Alert>
        <BackButton label="Retour" />
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
            minWidth: "80%",
          }}
        >
          <VideoPlayer
            video={video}
            streamUrl={getRoutes().video.stream(video.slug)}
          />
          <h1>{video.title}</h1>

          {downloadError && (
            <Alert canClose type="error" role="alert">
              {downloadError}
            </Alert>
          )}

          {/* -------------------- Infos vidéo -------------------- */}
          <div className={styles.video_infos}>
            <div className={styles.video_infos_header}>
              <p>{timeAgo(video.created_at)}</p>
              <p className={styles.video_infos_header_time}>
                <span className="material-icons" aria-hidden="true">
                  access_time
                </span>
                {formatTime(time)}
              </p>
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
              {isOwner && (
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
                {video.owner_last_name + " " + video.owner_first_name ||
                  video.owner}
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

            <div className={styles.video_infos_details_update}>
              <dt>
                <UpdateIcon aria-hidden="true" /> Mis à jour le
              </dt>
              <dd>{formatDateWithTime(video.updated_at)}</dd>
            </div>
          </dl>

          {/* Commentaires */}
          {video.disable_comment ? (
            <Alert type="info" role="alert">
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
          className={styles.video_infos_block_right}
          aria-label="Informations complémentaires"
        >
          <section>
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
