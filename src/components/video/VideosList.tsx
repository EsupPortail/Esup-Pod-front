import type { Video } from "@/src/types";
import VideoCard from "@/src/components/video/VideoCard";
import { useVideoPermissions } from "@/src/hooks/useVideoPermission";
import Grid from "@mui/material/Grid";
import { VideoCardSkeleton } from "./VideoCardSkeleton";

interface VideosListProps {
  videosList: Video[];
  loading?: boolean;
  selectable?: boolean;
  selectedVideoIds?: number[];
  onSelectVideo?: (videoId: number, checked: boolean) => void;
}

import { useSidebar } from "@/src/context/SidebarProvider";

export default function VideosList({
  videosList,
  loading = false,
  selectable = false,
  selectedVideoIds = [],
  onSelectVideo,
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
            <VideoCardItem
              video={video}
              selectable={selectable}
              isSelected={selectedVideoIds.includes(video.id)}
              onSelectToggle={(checked) => onSelectVideo?.(video.id, checked)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

interface VideoCardItemProps {
  video: Video;
  selectable?: boolean;
  isSelected?: boolean;
  onSelectToggle?: (checked: boolean) => void;
}

function VideoCardItem({
  video,
  selectable = false,
  isSelected = false,
  onSelectToggle,
}: VideoCardItemProps) {
  const { isOwnerOrCoOwner } = useVideoPermissions(video);

  return (
    <VideoCard
      video={video}
      isOwner={isOwnerOrCoOwner}
      selectable={selectable}
      selected={isSelected}
      onSelectToggle={onSelectToggle}
    />
  );
}
