import { Video } from "@/src/types/interface";
import VideoCard from "@/src/components/video/VideoCard";
import styles from "./VideoList.module.css";
import Grid from "@mui/material/Grid";

interface VideosListProps {
  videosList: Video[];
  currentUserId?: number;
}

export default function VideosList(props: VideosListProps) {
  return (
    <div className={styles.videos_list}>
      <Grid container spacing={2}>
        {props.videosList.map((video: Video) => (
          <Grid key={video.slug} size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 2 }}>
            <VideoCard
              video={video}
              isOwner={
                props.currentUserId != null &&
                video.owner_id === props.currentUserId
              }
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
