import type { Video } from "@/src/types";
import VideoCard from "@/src/components/video/VideoCard";
import { useVideoPermissions } from "@/src/hooks/useVideoPermission";
import Grid from "@mui/material/Grid";

interface VideosListProps {
  videosList: Video[];
}

export default function VideosList(props: VideosListProps) {
  return (
    <div style={{ padding: "var(--c--globals--spacings--md) 0" }}>
      <Grid container spacing={2}>
        {props.videosList.map((video: Video) => (
          <Grid
            key={video.id ?? video.slug}
            size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 2 }}
          >
            <VideoCardItem video={video} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

interface VideoCardItemProps {
  video: Video;
}

function VideoCardItem({ video }: VideoCardItemProps) {
  const { isOwnerOrCoOwner } = useVideoPermissions(video);

  return <VideoCard video={video} isOwner={isOwnerOrCoOwner} />;
}
