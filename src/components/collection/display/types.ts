import type { Channel, Theme, Playlist, Video } from "@/src/types";

export type CollectionViewMode = "cards" | "grid";
export type CollectionDisplayType = "channel" | "theme" | "playlist";

export interface CollectionDisplayProps {
  channels?: Channel[];
  themes?: Theme[];
  playlists?: Playlist[];
  videos?: Video[];
  defaultView?: CollectionViewMode;
  storageKey?: string;
  pageSize?: number;
  channelSlug?: string;
  basePath?: string;
  currentUserId?: number;
}

export interface CollectionViewToggleProps {
  view: CollectionViewMode;
  onChange: (view: CollectionViewMode) => void;
}

export interface CollectionDisplayRow {
  id: string;
  type: CollectionDisplayType;
  typeLabel: string;
  title: string;
  thumbnailUrl: string;
  videosCount: number;
  themesCount?: number;
  subThemesCount?: number;
  createdAtLabel?: string;
  createdAtValue?: string;
  updatedAtLabel?: string;
  updatedAtValue?: string;
  href: string;
  isOwner?: boolean;
  playlistSlug?: string;
}
