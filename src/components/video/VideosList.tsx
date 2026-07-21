import type { Video } from "@/src/types";
import VideoCard from "@/src/components/video/VideoCard";
import { useVideoPermissions } from "@/src/hooks/useVideoPermission";
import Grid from "@mui/material/Grid";
import { VideoCardSkeleton } from "./VideoCardSkeleton";

interface VideosListProps {
  videosList: Video[];
  loading?: boolean;
}

import { useSidebar } from "@/src/context/SidebarProvider";

export default function VideosList({
  videosList,
  loading = false,
}: VideosListProps) {
  const { sidebarFixed } = useSidebar();
  const xlSize = sidebarFixed ? 4 : 3;
  const lgSize = sidebarFixed ? 6 : 4;
  const mdSize = sidebarFixed ? 6 : 6;

  if (loading) {
    return (
      <div style={{ padding: "var(--c--globals--spacings--md) 0" }}>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid
              key={`video-skeleton-${index}`}
              size={{ xs: 12, sm: 12, md: mdSize, lg: lgSize, xl: xlSize }}
              sx={{ display: "flex" }}
            >
              <VideoCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--c--globals--spacings--md) 0" }}>
      <Grid container spacing={2}>
        {videosList.map((video: Video) => (
          <Grid
            key={video.id ?? video.slug}
            size={{ xs: 12, sm: 12, md: mdSize, lg: lgSize, xl: xlSize }}
            sx={{ display: "flex" }}
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
