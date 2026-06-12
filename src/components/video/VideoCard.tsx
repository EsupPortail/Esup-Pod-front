import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import styles from "./VideoCard.module.css";
import Link from "next/link";
import type { Video } from "@/src/types";
import { formatTime, timeAgo, secondToMinute } from "@/src/constants/date";
import { truncateVideoTitle } from "@/src/constants/string";
import VideoActionMenu from "@/src/components/video/VideoActionMenu";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DownloadingIcon from "@mui/icons-material/Downloading";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import ErrorIcon from "@mui/icons-material/Error";

interface VideosCardProps {
  video: Video;
  isOwner?: boolean;
}

export default function VideoCard(props: VideosCardProps) {
  const { video, isOwner = false } = props;
  const time = secondToMinute(video.duration || 0);

  return (
    <Card
      sx={{
        maxWidth: 345,
        position: "relative",
      }}
    >
      <CardActionArea
        component={Link}
        href={`/video/${video.slug}`}
        sx={{
          textDecoration: "none",
        }}
      >
        <CardMedia
          component="img"
          height="150px"
          image={video.thumbnail_url || "/default_thumbnail.svg"}
          alt={video.title}
          sx={{
            maxHeight: 140,
          }}
        />
        <div className={styles.video_duration}>
          <span className="material-icons">access_time</span>
          {formatTime(time)}
        </div>
        <CardContent sx={{ position: "relative" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              fontSize: "var(--c--globals--font--sizes--xl)",
              fontWeight: "var(--c--globals--font--weights--bold)",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {truncateVideoTitle(video.title, 20)}
          </Typography>
          <div className={styles.video_infos}>
            <Typography
              sx={{
                fontSize: "var(--c--globals--font--sizes--xs)",
                color: "text.secondary",
              }}
            >
              {timeAgo(video.created_at)}
            </Typography>
            <div className={styles.video_icons}>
              {video.encoding_status == "ER" && isOwner && (
                <Tooltip title="Erreur d'encodage">
                  <ErrorIcon color="error" />
                </Tooltip>
              )}
              {video.encoding_status == "PE" && isOwner && (
                <Tooltip title="Vidéo en attente d'encodage">
                  <PauseCircleFilledIcon color="warning" />
                </Tooltip>
              )}
              {video.encoding_status == "PR" && isOwner && (
                <Tooltip title="Vidéo en cours d'encodage">
                  <DownloadingIcon sx={{ color: "var(--background-brand)" }} />
                </Tooltip>
              )}
              {video.encoding_status == "DO" && isOwner && (
                <Tooltip title="Encodage terminé">
                  <CheckCircleOutlinedIcon color="success" />
                </Tooltip>
              )}
              {video.status == "DR" && (
                <Tooltip title="Vidéo privée">
                  <span className="material-icons">visibility_off</span>
                </Tooltip>
              )}
              {video.has_password && (
                <Tooltip title="Vidéo protégée par un mot de passe">
                  <span className="material-icons">key</span>
                </Tooltip>
              )}
              {video.is_auth_required && (
                <Tooltip title="Vidéo visible pour les utilisateurs authentifiés">
                  <span className="material-icons">verified_user</span>
                </Tooltip>
              )}
            </div>
          </div>
        </CardContent>
      </CardActionArea>
      {isOwner && (
        <CardActions
          sx={{ position: "absolute", top: 8, left: 8, zIndex: 2, padding: 0 }}
        >
          <VideoActionMenu video={video} />
        </CardActions>
      )}
    </Card>
  );
}
