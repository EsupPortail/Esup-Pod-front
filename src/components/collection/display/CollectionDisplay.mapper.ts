import type { Channel, Theme, Playlist, Video } from "@/src/types";
import type { CollectionDisplayRow } from "./types";

const dateFormatters = new Map<string, Intl.DateTimeFormat>();

/** Returns the cached date formatter for a locale. */
function getDateFormatter(locale: string): Intl.DateTimeFormat {
  const cachedFormatter = dateFormatters.get(locale);
  if (cachedFormatter) return cachedFormatter;

  const formatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  dateFormatters.set(locale, formatter);
  return formatter;
}

/** Formats a date for display in the requested locale. */
function formatDate(value: string | undefined, locale: string) {
  if (!value) return "";
  return getDateFormatter(locale).format(new Date(value));
}

/** Maps a channel to a collection display row. */
export function mapChannelToDisplayRow(
  channel: Channel,
  locale: string,
): CollectionDisplayRow {
  return {
    id: `channel-${channel.id}`,
    type: "channel",
    typeLabel: "Chaîne",
    title: channel.title,
    thumbnailUrl: channel.logo || channel.banner || "/default_channel_logo.png",
    videosCount: channel.videos_count ?? 0,
    themesCount: channel.themes_count ?? 0,
    createdAtValue: channel.created_at,
    createdAtLabel: formatDate(channel.created_at, locale),
    updatedAtValue: channel.updated_at,
    updatedAtLabel: formatDate(channel.updated_at, locale),
    href: `/channel/${channel.slug}`,
  };
}

/** Maps a theme to a collection display row. */
export function mapThemeToDisplayRow(
  theme: Theme,
  locale: string,
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
    videosCount: theme.videos_count ?? theme.items?.length ?? 0,
    subThemesCount: theme.children?.length ?? 0,
    createdAtValue: theme.created_at,
    createdAtLabel: formatDate(theme.created_at, locale),
    updatedAtValue: theme.updated_at,
    updatedAtLabel: formatDate(theme.updated_at, locale),
    href,
  };
}

/** Maps a playlist to a collection display row. */
export function mapPlaylistToDisplayRow(
  playlist: Playlist,
  locale: string,
  currentUserId?: number,
): CollectionDisplayRow {
  const isOwner = currentUserId != null && playlist.owner === currentUserId;

  return {
    id: `playlist-${playlist.id}`,
    type: "playlist",
    typeLabel: "Playlist",
    title: playlist.title,
    thumbnailUrl: "/default_thumbnail.svg",
    videosCount: playlist.videos_count ?? playlist.items?.length ?? 0,
    createdAtValue: playlist.created_at,
    createdAtLabel: formatDate(playlist.created_at, locale),
    updatedAtValue: playlist.updated_at,
    updatedAtLabel: formatDate(playlist.updated_at, locale),
    href: `/playlist/${playlist.slug}`,
    isOwner,
    playlistSlug: playlist.slug,
  };
}

/** Maps available collections to display rows. */
export function mapCollectionsToDisplayRows({
  channels = [],
  themes = [],
  playlists = [],
  channelSlug,
  basePath,
  currentUserId,
  locale,
}: {
  channels?: Channel[];
  themes?: Theme[];
  playlists?: Playlist[];
  videos?: Video[];
  channelSlug?: string;
  basePath?: string;
  currentUserId?: number;
  locale: string;
}): CollectionDisplayRow[] {
  const rows: CollectionDisplayRow[] = [];

  // calculer le nombre de thèmes par chaîne.
  if (channels.length > 0) {
    rows.push(
      ...channels.map((channel) => mapChannelToDisplayRow(channel, locale)),
    );
  }

  // On ne crée des lignes "thème" que lorsqu'on n'affiche pas de chaînes.
  if (channels.length === 0 && themes.length > 0) {
    rows.push(
      ...themes.map((theme) =>
        mapThemeToDisplayRow(theme, locale, { channelSlug, basePath }),
      ),
    );
  }

  if (playlists.length > 0) {
    rows.push(
      ...playlists.map((playlist) =>
        mapPlaylistToDisplayRow(playlist, locale, currentUserId),
      ),
    );
  }

  return rows;
}
