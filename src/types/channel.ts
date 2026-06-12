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
  created_at: string;
  updated_at: string;
  children: Theme[] | null;
  items: ThemeItem[] | null;
}
