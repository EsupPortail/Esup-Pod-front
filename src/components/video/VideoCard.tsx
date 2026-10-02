import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Checkbox } from "@openfun/cunningham-react";
import styles from "./VideoCard.module.css";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { setInitial, getVideoOwnerDisplayName } from "@/src/constants/user";
import { usePathname, useParams } from "next/navigation";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import type { Video } from "@/src/types";
import { formatTime, timeAgo, secondToMinute } from "@/src/constants/date";
import VideoActionMenu from "@/src/components/video/VideoActionMenu";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DownloadingIcon from "@mui/icons-material/Downloading";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useTranslation } from "@/src/hooks/useTranslation";

interface VideosCardProps {
  video: Video;
  isOwner?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelectToggle?: (checked: boolean) => void;
}

export default function VideoCard(props: VideosCardProps) {
  const {
    video,
    isOwner = false,
    selectable = false,
    selected = false,
    onSelectToggle,
  } = props;
  const { locale, t } = useTranslation();
  const time = secondToMinute(video.duration || 0);

  // Context detection: playlist or favorites
  const pathname = usePathname();
  const params = useParams();

  let href = `/video/${video.slug}`;

  // If we are on a /playlist/[slug] page
  if (pathname?.startsWith("/playlist/") && "slug" in params) {
    const rawSlug = (params as { slug?: string | string[] }).slug;
    const playlistSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    if (playlistSlug) {
      href = `/video/${video.slug}?playlist=${playlistSlug}`;
    }
  }

  // If we are on the favorites page (/playlist/favorites)
  if (pathname === "/playlist/favorites") {
    href = `/video/${video.slug}?favorites=1`;
  }

  const { config } = useAppConfig();
  const displayName = getVideoOwnerDisplayName(
    video,
    config?.authentication,
    true,
  );
  const isAnonymous = displayName === "Anonyme";
  const initial = isAnonymous
    ? "A"
    : setInitial(video.owner_last_name, video.owner_first_name);

  return (
    <Card
      className={`${styles.card} ${selected ? styles["card-selected"] : ""}`}
      component="article"
      elevation={0}
    >
      {selectable && (
        <div
          className={styles["select-checkbox"]}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            label=""
            checked={selected}
            onChange={(e) => {
              onSelectToggle?.((e.target as HTMLInputElement).checked);
            }}
            aria-label={t("a11y.chooseVideo")}
          />
        </div>
      )}

      <CardActionArea
        component={Link}
        href={href}
        className={styles["action-area"]}
        disableRipple
      >
        <div className={styles["thumbnail-container"]}>
          <CardMedia
            component="img"
            image={
              video.thumbnail_url || video.thumbnail || "/default_thumbnail.svg"
            }
            alt={t("a11y.videoThumbnail", { title: video.title })}
            className={styles.thumbnail}
          />

          <time
            dateTime={`PT${video.duration}S`}
            className={styles.video_duration}
          >
            {formatTime(time)}
          </time>
        </div>

        <CardContent className={styles["card-content"]}>
          <Avatar className={styles.avatar}>{initial}</Avatar>

          <div className={styles["video-content"]}>
            <div className={styles["video-header"]}>
              <Typography component="div" className={styles["video-title"]}>
                {video.title}
              </Typography>

              <div className={styles["video-icons"]}>
                {video.encoding_status == "ER" && isOwner && (
                  <Tooltip title={t("table.encodingError")}>
                    <ErrorIcon
                      color="error"
                      className={styles["encoding-icon"]}
                    />
                  </Tooltip>
                )}
                {video.encoding_status == "PE" && isOwner && (
                  <Tooltip title={t("table.pendingEncoding")}>
                    <PauseCircleFilledIcon
                      color="warning"
                      className={styles["encoding-icon"]}
                    />
                  </Tooltip>
                )}
                {video.encoding_status == "PR" && isOwner && (
                  <Tooltip title={t("videoPlayer.encodingInProgress")}>
                    <DownloadingIcon className={styles["downloading-icon"]} />
                  </Tooltip>
                )}
                {video.encoding_status == "DO" && isOwner && (
                  <Tooltip title={t("table.encodingCompleted")}>
                    <CheckCircleOutlinedIcon
                      color="success"
                      className={styles["encoding-icon"]}
                    />
                  </Tooltip>
                )}
                {video.status === "DR" && (
                  <Tooltip title={t("videoEdit.draftPrivateTitle")}>
                    <VisibilityOffOutlinedIcon
                      className={styles["status-icon"]}
                    />
                  </Tooltip>
                )}
                {video.has_password && (
                  <Tooltip title={t("common.passwordProtected")}>
                    <LockOutlinedIcon className={styles["status-icon"]} />
                  </Tooltip>
                )}
                {video.is_auth_required && (
                  <Tooltip title={t("videoEdit.authUserOnly")}>
                    <ShieldOutlinedIcon className={styles["status-icon"]} />
                  </Tooltip>
                )}
                {isOwner && (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <VideoActionMenu video={video} />
                  </div>
                )}
              </div>
            </div>

            <Typography component="div" className={styles["video-info"]}>
              <address className={styles["video-owner"]} title={displayName}>
                {displayName}
              </address>
              <time
                dateTime={video.created_at}
                className={styles["video-date"]}
              >
                {timeAgo(video.created_at, locale)}
              </time>
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
