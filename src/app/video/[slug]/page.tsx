"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Alert, Button, Loader } from "@openfun/cunningham-react";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import VideoPlayer from "@/src/components/VideoPlayer/page";
import Comments from "@/src/components/Comments/page";
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
import DownloadIcon from "@mui/icons-material/Download";
import UpdateIcon from "@mui/icons-material/Update";
import styles from "./page.module.css";

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
  const { fetchUser, user: videoUser } = useUsers();
  const time = secondToMinute(video?.duration || 0);
  const { user, accessToken, refresh } = useAuth();
  const isOwner = user?.id != null && video?.owner_id === user?.id;
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchOne(slug);
  }, [slug, fetchOne]);

  useEffect(() => {
    if (video) {
      fetchUser(video.owner_id);
    }
  }, [video, fetchUser]);

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

  if (!slug) {
    return (
      <Alert canClose type="error">
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
        <Alert canClose type="error">
          {useVideoError ?? "Impossible de charger cette video."}
        </Alert>

        <Button
          onClick={() => router.back()}
          color="brand"
          variant="secondary"
          type="button"
        >
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.main_video_content}>
      <div
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
          <Alert canClose type="error">
            {downloadError}
          </Alert>
        )}
        <div className={styles.video_infos}>
          <div className={styles.video_infos_header}>
            <p>{timeAgo(video.created_at)}</p>
            <p className={styles.video_infos_header_time}>
              {" "}
              <span className="material-icons">access_time</span>
              {formatTime(time)}
            </p>
          </div>

          <div className={styles.video_infos_header_buttons}>
            {video.allow_downloading && (
              <Button
                color="brand"
                size="small"
                variant="bordered"
                icon={<DownloadIcon />}
                iconPosition="right"
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? "Téléchargement..." : "Télécharger la vidéo"}
              </Button>
            )}

            {isOwner && (
              <Button
                onClick={() => {
                  router.push(`/video/edit/${video.slug}`);
                }}
                size="small"
                color="brand"
                variant="primary"
                type="button"
              >
                Éditer la video
              </Button>
            )}
          </div>
        </div>
        <Divider />
        <div className={styles.video_infos_description}>
          <p>{video.description}</p>
        </div>

        <Divider />
        <div className={styles.video_infos_details}>
          <p>
            Chaine : <span> {video.channel ? video.channel : "Aucune"} </span>
          </p>
          <p>
            Ajouté par :{" "}
            <span>
              {videoUser ? getUserDisplayName(videoUser) : video.owner}
            </span>
          </p>
          <p>
            Langue principale : <span>{getLanguageLabel(video.language)}</span>
          </p>
          <div className={styles.video_infos_details_tags}>
            <p>Mots clés : </p>
            {video.tags?.map((label) => (
              <Chip key={label} label={label} sx={{ margin: "0 2px" }} />
            ))}
          </div>
          <p className={styles.video_infos_details_update}>
            <UpdateIcon />
            Mis à jour le :{formatDateWithTime(video.updated_at)}
          </p>
          <Comments videoSlug={video.slug} />{" "}
        </div>
      </div>
      <div className={styles.video_infos_block_right}>
        <div>
          <div>
            <h2 className={styles.video_infos_block_right_title}>A propos</h2>
            <Divider />

            <h4>
              <LibraryBooksIcon fontSize="small" /> Type
            </h4>
            <span>{video.type_name}</span>
            <h4>
              <SchoolIcon fontSize="small" />
              Discipline.s{" "}
            </h4>
            <ul>
              {video.discipline_details?.map((discipline) => (
                <li key={discipline.id}>{discipline.title}</li>
              ))}
            </ul>
            <h4>
              <MonitorIcon fontSize="small" />
              Licence
            </h4>
            <span>{video.license ? video.license : "Aucune"}</span>
            <h4>
              <PieChartIcon fontSize="small" />
              Cursus
            </h4>
            <span>{getCursusLabel(video.cursus)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
