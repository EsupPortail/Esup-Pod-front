import { ElementType } from "react";

export interface VideoSubtitle {
  id: number;
  video: number;
  language: string;
  file: string;
  is_default: boolean;
}
/*
DR - Draft (Private)
PU - Published (Public)
RE - Restricted (Access Controlled)
EN - Encoding in progress
ER - Encoding Error
*/
export type VideoStatus = "DR" | "PU" | "RE" | "EN" | "ER";

export type VideoLicense =
  | "CC-BY"
  | "CC-BY-SA"
  | "CC-BY-NC"
  | "CC-BY-ND"
  | "COPYRIGHT"
  | ""
  | null;

export interface AppConfig {
  USE_CAS?: boolean;
  VIDEO_LICENSE_CHOICES?: string[];
  [key: string]: unknown;
}

export interface AppInfo {
  project: string;
  version: string;
}

//Objet Video renvoyé par l'API
export interface Video {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  video_url: string | null;
  thumbnail: string | null;
  duration: number | null;
  is_360: boolean;
  is_video: boolean;
  owner: string;
  owner_id: number;
  co_owners: number[] | null;
  status: VideoStatus;
  status_label: string | null;
  is_auth_required: boolean;
  thumbnail_url: string | null;
  has_password: boolean;
  subtitles: VideoSubtitle[] | null;
  allow_downloading: boolean;
  disable_comment: boolean;
  date_of_event: string | null;
  license: VideoLicense;
  cursus: string | null;
  language: string | null;
  created_at: string;
  updated_at: string;
  date_to_delete: string | null;
}
// Objet Video pour le formulaire de création
export interface VideoRequest {
  title: string;
  description?: string;
  video_file: File;
  thumbnail?: File;
  is_360?: boolean;
  co_owners?: number[];
  status?: VideoStatus;
  is_auth_required?: boolean;
  password?: string;
  allow_downloading?: boolean;
  disable_comment?: boolean;
  date_of_event?: string;
  license?: string;
  cursus?: string;
  language?: string;
  date_to_delete?: string;
}

export interface MenuItemProps {
  name: string;
  link?: string;
  Icon?: ElementType;
  items?: MenuItemProps[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  affiliation: string;
  establishment: string;
  userpicture: string;
}
