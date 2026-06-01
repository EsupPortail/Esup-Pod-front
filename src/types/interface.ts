import { ElementType } from "react";
import type { CursusCode } from "@/src/constants/cursus";
import type { LanguageSubtitle } from "@/src/constants/language";
import type {
  VideoLicense,
  VideoStatus,
  VideoEncodingStatus,
} from "@/src/constants/video";

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
  owner_first_name: string;
  owner_last_name: string;
  channel: number;
  co_owners: number[] | null;
  status: VideoStatus;
  status_label: string | null;
  encoding_status: VideoEncodingStatus | null;
  encoding_status_label: string | null;
  is_auth_required: boolean;
  thumbnail_url: string | null;
  has_password: boolean;
  subtitles: Subtitle[] | null;
  allow_downloading: boolean;
  disable_comment: boolean;
  date_of_event: string | null;
  license: VideoLicense;
  cursus: CursusCode | null;
  language: string | null;
  created_at: string;
  updated_at: string;
  date_to_delete: string | null;
  tags: string[] | null;
  discipline: number[] | null;
  discipline_details: Discipline[] | null;
  type_id?: number | null;
  type_name: string | null;
}

// Objet Video pour le formulaire de création et d'édition
export interface VideoRequest {
  title: string;
  description?: string;
  video_file?: File;
  thumbnail?: File;
  is_360?: boolean;
  co_owners?: number[];
  status?: VideoStatus;
  is_auth_required?: boolean;
  password?: string;
  allow_downloading?: boolean;
  disable_comment?: boolean;
  date_of_event?: string;
  date_to_delete?: string;
  license?: string;
  cursus?: string;
  language?: string;
  type_id: number;
  channel?: number;
  disciplines?: number[];
  tags?: string[];
  restricted_groups?: number[];
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

export interface Discipline {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sites: Array<number> | null;
}

export interface Tags {
  id: number;
  name: string;
  slug: string;
  count: number | null;
}

export interface Type {
  id: number;
  slug: string;
  title: string;
  sites: Array<number> | null;
}

export interface Subtitle {
  id: number;
  video: number;
  language: LanguageSubtitle;
  file: string;
  is_default: boolean;
}

export interface Comment {
  id: string;
  parent: number | null;
  direct_parent: number | null;
  author: number;
  author_name: string;
  content: string;
  video: number;
  added: string;
  nbr_vote: number;
  is_owner: boolean;
  children: Comment[];
}

export interface CommentRequest {
  id: string;
  parent: number | null;
  direct_parent: number | null;
  content: string;
  video: number;
}
