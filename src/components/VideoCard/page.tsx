import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import styles from "./page.module.css";
import Link from "next/link";
import { Video } from "@/src/types/interface";
import { formatTime, secondToMinute } from "@/src/utils/helper";

interface VideosCardProps {
  video: Video;
}

export default function VideoCard(props: VideosCardProps) {
  const { video } = props;
  const time = secondToMinute(video.time);
  console.log(time);
  return (
    <Link key="video-link" href="/video" style={{ textDecoration: "none" }}>
      <Card sx={{ width: 260 }}>
        <CardMedia
          sx={{ height: 160 }}
          image={video.thumbnail}
          title={video.title}
        />
        <CardContent
          sx={{
            height: 70,
          }}
        >
          <div className={styles.video_infos}>
            <p className={styles.video_title}>{video.title}</p>
            {video.isPrivate && (
              <span className="material-icons">visibility_off</span>
            )}
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
