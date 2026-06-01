import type { Video } from "@/src/types/interface";

/*Typage des props pour le composant DisplayVideo*/

export type VideoViewMode = "cards" | "grid";

export interface VideosDisplayProps {
  videos: Video[];
  currentUserId?: number;
  defaultView?: VideoViewMode;
  storageKey?: string;
  pageSize?: number;
}

export interface VideoViewToggleProps {
  view: VideoViewMode;
  onChange: (view: VideoViewMode) => void;
}

export interface VideoDisplayRow {
  id: string;
  video: Video;
  slug: string;
  title: string;
  thumbnailUrl: string;
  durationLabel: string;
  createdAtLabel: string;
  createdAtValue: string;
  owner: string;
  ownerId: number;
  isOwner: boolean;
  status: string;
  statusLabel: string;
  statusEncoding: string;
  hasPassword: boolean;
  isRestricted: boolean;
  href: string;
  editHref: string;
  deleteHref: string;
}
