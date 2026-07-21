import Grid from "@mui/material/Grid";
import type { Playlist } from "@/src/types";
import PlaylistCard from "@/src/components/collection/PlaylistCard";
import { usePlaylistPermissions } from "@/src/hooks/usePlaylistPermission";
import PlaylistCardSkeleton from "./PlaylistCardSkeleton";
import { useSidebar } from "@/src/context/SidebarProvider";

type PlaylistListProps = {
  playlists: Playlist[];
  basePath?: string;
  loading?: boolean;
};

export default function PlaylistList({
  playlists,
  basePath = "/playlist",
  loading = false,
}: PlaylistListProps) {
  const { sidebarFixed } = useSidebar();
  const xlSize = sidebarFixed ? 4 : 3;
  const lgSize = sidebarFixed ? 6 : 4;
  const mdSize = sidebarFixed ? 6 : 6;

  if (loading) {
    return (
      <div style={{ padding: "var(--c--globals--spacings--sm) 0" }}>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid
              key={`playlist-skeleton-${index}`}
              size={{ xs: 12, sm: 12, md: mdSize, lg: lgSize, xl: xlSize }}
            >
              <PlaylistCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--c--globals--spacings--sm) 0" }}>
      <Grid container spacing={2}>
        {playlists.map((playlist) => (
          <Grid
            key={playlist.slug}
            size={{ xs: 12, sm: 12, md: mdSize, lg: lgSize, xl: xlSize }}
          >
            <PlaylistCardItem
              playlist={playlist}
              href={`${basePath}/${playlist.slug}`}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
interface PlaylistCardItemProps {
  playlist: Playlist;
  href: string;
}
function PlaylistCardItem({ playlist, href }: PlaylistCardItemProps) {
  const { isOwner } = usePlaylistPermissions(playlist);

  return <PlaylistCard playlist={playlist} isOwner={isOwner} href={href} />;
}
