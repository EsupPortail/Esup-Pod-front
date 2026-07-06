import type { Channel, Theme, Playlist, Video } from "@/src/types";
import type { CollectionDisplayRow } from "./types";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(value?: string) {
  if (!value) return "";
  return dateFormatter.format(new Date(value));
}

export function mapChannelToDisplayRow(
  channel: Channel,
  allThemes: Theme[],
  allVideos: Video[] = [],
): CollectionDisplayRow {
  const channelThemes = allThemes.filter(
    (theme) => theme.channel === channel.id,
  );

  const channelVideos = allVideos.filter(
    (video) =>
      video.channel === channel.id &&
      video.status === "PU" &&
      video.encoding_status === "DO",
  );
  return {
    id: `channel-${channel.id}`,
    type: "channel",
    typeLabel: "Chaîne",
    title: channel.title,
    thumbnailUrl: channel.logo || "/default_channel_logo.png",
    videosCount: channelVideos.length,
    themesCount: channelThemes.length,
    createdAtValue: channel.created_at,
    createdAtLabel: formatDate(channel.created_at),
    updatedAtValue: channel.updated_at,
    updatedAtLabel: formatDate(channel.updated_at),
    href: `/channel/${channel.slug}`,
  };
}

export function mapThemeToDisplayRow(
  theme: Theme,
  options?: { channelSlug?: string; basePath?: string },
): CollectionDisplayRow {
  const { channelSlug, basePath } = options ?? {};

  let href: string;
  if (channelSlug) {
    const suffix = basePath ? `${basePath}/${theme.slug}` : theme.slug;
    href = `/channel/${channelSlug}/${suffix}`;
  } else {
    href = `/themes/${theme.slug}`;
  }

  return {
    id: `theme-${theme.id}`,
    type: "theme",
    typeLabel: "Thème",
    title: theme.title,
    thumbnailUrl: theme.banner || "/default_theme_banner.png",
    videosCount: theme.items?.length ?? 0,
    subThemesCount: theme.children?.length ?? 0,
    createdAtValue: theme.created_at,
    createdAtLabel: formatDate(theme.created_at),
    updatedAtValue: theme.updated_at,
    updatedAtLabel: formatDate(theme.updated_at),
    href,
  };
}

export function mapPlaylistToDisplayRow(
  playlist: Playlist,
  currentUserId?: number,
): CollectionDisplayRow {
  const isOwner = currentUserId != null && playlist.owner === currentUserId;

  return {
    id: `playlist-${playlist.id}`,
    type: "playlist",
    typeLabel: "Playlist",
    title: playlist.title,
    thumbnailUrl: "/default_thumbnail.svg",
    videosCount: playlist.items?.length ?? 0,
    createdAtValue: playlist.created_at,
    createdAtLabel: formatDate(playlist.created_at),
    updatedAtValue: playlist.updated_at,
    updatedAtLabel: formatDate(playlist.updated_at),
    href: `/playlist/${playlist.slug}`,
    isOwner,
    playlistSlug: playlist.slug,
  };
}

export function mapCollectionsToDisplayRows({
  channels = [],
  themes = [],
  playlists = [],
  videos = [],
  channelSlug,
  basePath,
  currentUserId,
}: {
  channels?: Channel[];
  themes?: Theme[];
  playlists?: Playlist[];
  videos?: Video[];
  channelSlug?: string;
  basePath?: string;
  currentUserId?: number;
}): CollectionDisplayRow[] {
  const rows: CollectionDisplayRow[] = [];

  // calculer le nombre de thèmes par chaîne.
  if (channels.length > 0) {
    rows.push(
      ...channels.map((channel) =>
        mapChannelToDisplayRow(channel, themes, videos),
      ),
    );
  }

  // On ne crée des lignes "thème" que lorsqu'on n'affiche pas de chaînes.
  if (channels.length === 0 && themes.length > 0) {
    rows.push(
      ...themes.map((theme) =>
        mapThemeToDisplayRow(theme, { channelSlug, basePath }),
      ),
    );
  }

  if (playlists.length > 0) {
    rows.push(
      ...playlists.map((playlist) =>
        mapPlaylistToDisplayRow(playlist, currentUserId),
      ),
    );
  }

  return rows;
}
