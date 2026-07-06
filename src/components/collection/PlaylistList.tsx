import Grid from "@mui/material/Grid";
import type { Playlist } from "@/src/types";
import PlaylistCard from "@/src/components/collection/PlaylistCard";
import { usePlaylistPermissions } from "@/src/hooks/usePlaylistPermission";

type PlaylistListProps = {
  playlists: Playlist[];
  basePath?: string;
};

export default function PlaylistList({
  playlists,
  basePath = "/playlist",
}: PlaylistListProps) {
  return (
    <div style={{ padding: "var(--c--globals--spacings--sm) 0" }}>
      <Grid container spacing={2}>
        {playlists.map((playlist) => (
          <Grid
            key={playlist.slug}
            size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 2 }}
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
