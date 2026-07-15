import { CollectionOrder } from "../constants/collection";
import type { Video } from "./video";

export interface Channel {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  owner: number;
  owner_username: string;
  is_public: boolean;
  logo: string | null;
  banner: string | null;
  colloborators: number[] | null;
  created_at: string;
  updated_at: string;
  default_order: CollectionOrder;
  videos_count?: number;
  themes_count?: number;
}

export interface ThemeItem {
  id: number;
  video: Video;
  added_at: string;
}

export interface Theme {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  parent: number | null;
  channel: number | null;
  banner: string | null;
  created_at: string;
  updated_at: string;
  children: Theme[] | null;
  items: ThemeItem[] | null;
  videos_count?: number;
  default_order: CollectionOrder;
}

export interface PlaylistItem {
  id: number;
  video: Video;
  position: number;
  added_at: string;
}

export interface Playlist {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  owner: number;
  owner_username: string;
  is_public: boolean;
  is_protected: boolean;
  created_at: string;
  updated_at: string;
  items: PlaylistItem[] | null;
  videos_count?: number;
  default_order: CollectionOrder;
}

export interface PlaylistRequest {
  title: string;
  description: string | null;
  password: string | null;
  is_public: boolean;
  default_order: CollectionOrder;
}

export interface Favorite {
  id: number;
  user: number;
  user_username: string;
  video: number;
  video_details: Video;
  added_at: string;
}
