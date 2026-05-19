import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import styles from "./page.module.css";
import Link from "next/link";
import { Video } from "@/src/types/interface";
import { formatTime, timeAgo, secondToMinute } from "@/src/constants/date";
import { truncateVideoTitle } from "@/src/constants/string";

import VideoCardActionMenu from "./videoCardActionMenu";

interface VideosCardProps {
  video: Video;
  isOwner?: boolean;
}

export default function VideoCard(props: VideosCardProps) {
  const { video, isOwner = false } = props;
  const time = secondToMinute(video.duration || 0);
  console.log(video);

  return (
    <Card sx={{ maxWidth: 345, position: "relative" }}>
      <CardActionArea
        component={Link}
        href={`/video/${video.slug}`}
        sx={{ textDecoration: "none" }}
      >
        <CardMedia
          component="img"
          height="150px"
          image={video.thumbnail_url || "/default_thumbnail.svg"}
          alt={video.title}
          sx={{
            maxHeight: 140,
            backgroundColor: "var(--c--globals--colors--gray-150)",
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
              {video.status == "DR" && (
                <Tooltip title="Vidéo à acces restreint">
                  <span className="material-icons">visibility_off</span>
                </Tooltip>
              )}
              {video.has_password && (
                <Tooltip title="Vidéo protégée par un mot de passe">
                  <span className="material-icons">key</span>
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
          <VideoCardActionMenu video={video} />
        </CardActions>
      )}
    </Card>
  );
}
