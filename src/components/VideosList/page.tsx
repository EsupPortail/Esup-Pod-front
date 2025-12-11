import { Video } from "@/src/types/interface";
import VideoCard from "..//VideoCard/page";
import styles from "./page.module.css";
import Grid from "@mui/material/Grid";

interface VideosListProps {
  videosList: Video[];
}

export default function VideosList(props: VideosListProps) {
  return (
    <div className={styles.videos_list}>
      <Grid container spacing={2}>
        {props.videosList.map((video: Video) => (
          <Grid key={video.id} size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 2 }}>
            <VideoCard video={video} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
