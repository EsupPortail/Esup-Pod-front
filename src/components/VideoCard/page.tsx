import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Tooltip from "@mui/material/Tooltip";
import styles from "./page.module.css";
import Link from "next/link";
import { Video } from "@/src/types/interface";
import {
  formatTime,
  secondToMinute,
  truncateVideoTitle,
} from "@/src/utils/helper";

interface VideosCardProps {
  video: Video;
  isOwner?: boolean;
}

export default function VideoCard(props: VideosCardProps) {
  const { video, isOwner = false } = props;
  const time = secondToMinute(video.duration || 0);
  const href = `/video/${video.id}`;
  console.log(video);

  return (
    <Link key="video-link" href={href} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          width: 260,
          backgroundColor:
            "var(--c--contextuals--background--surface--secondary)",
          color: "var(--c--contextuals--content--semantic--neutral--primary)",
        }}
      >
        <CardMedia
          sx={{
            height: 160,
            backgroundColor: "var(--c--globals--colors--gray-150)",
          }}
          image={video.thumbnail || "/default_thumbnail.svg"}
          title={video.title}
        />
        <CardContent
          sx={{
            height: 70,
            backgroundColor:
              video.status === "DR"
                ? "var(--c--globals--colors--gray-050)"
                : "transparent",
          }}
        >
          <div className={styles.video_infos}>
            <p className={styles.video_title}>
              {truncateVideoTitle(video.title)}
            </p>
            <div className={styles.video_icons}>
              {video.status == "DR" && (
                <Tooltip title="Video a acces restreint">
                  <span className="material-icons">visibility_off</span>
                </Tooltip>
              )}
              {video.has_password && (
                <Tooltip title="Video protégée par mot de passe">
                  <span className="material-icons">key</span>
                </Tooltip>
              )}

              {isOwner && (
                <Tooltip title="Editer la video">
                  <Link
                    href={`/video/edit/${video.slug}`}
                    className={styles.icon_action}
                    aria-label="Editer la video"
                  >
                    <span className="material-icons">edit</span>
                  </Link>
                </Tooltip>
              )}
              {isOwner && (
                <Tooltip title="Supprimer la video">
                  <span className={`material-icons ${styles.icon_action}`}>
                    delete_outline
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
          <div className={styles.video_duration}>
            <span className="material-icons">access_time</span>
            {formatTime(time)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
