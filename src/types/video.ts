import type { CursusCode } from "@/src/constants/cursus";
import type { LanguageSubtitle } from "@/src/constants/language";
import type {
  VideoEncodingStatus,
  VideoLicense,
  VideoStatus,
} from "@/src/constants/video";

export interface Chapter {
  id: number;
  video: number;
  title: string;
  time_start: number;
  created_at?: string;
  updated_at?: string;
}

export interface SocialNetwork {
  id: number;
  name: string;
  icon_name: string;
  share_url_template: string;
  is_active: boolean;
  order: number;
}

export interface DownloadOption {
  label: string;
  resolution: string;
  url: string;
}

// Objet Video renvoye par l'API
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
  channel: number | string | null;
  themes: number[];
  co_owners: number[] | null;
  status: VideoStatus;
  status_label: string | null;
  encoding_status: VideoEncodingStatus | null;
  encoding_status_label: string | null;
  is_auth_required: boolean;
  thumbnail_url: string | null;
  has_password: boolean;
  has_video_file?: boolean;
  subtitles: Subtitle[] | null;
  allow_downloading: boolean;
  disable_comment: boolean;
  date_of_event: string | null;
  publication_date?: string | null;
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
  views?: number | null;
  documents?: VideoDocument[] | null;
  chapters?: Chapter[] | null;
  dressing?: number | null;
  social_networks?: number[] | null;
  social_network_details?: SocialNetwork[] | null;
  download_options?: DownloadOption[] | null;
}

// Objet Video pour le formulaire de creation et d'edition
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
  channel?: number | null;
  themes?: number[];
  disciplines?: number[];
  tags?: string[];
  restricted_groups?: number[];
}

export interface Subtitle {
  id: number;
  video: number;
  language: LanguageSubtitle;
  file: string;
  is_default: boolean;
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

export interface VideoDocument {
  id: number;
  video: number;
  title: string;
  file: string;
  is_private: boolean;
  created_at: string;
}

export interface VideoStats {
  video_slug: string;
  total_views: number;
  views_last_7_days: number;
  views_last_30_days: number;
  peak_day: string | null;
  peak_count: number | null;
  daily_breakdown: Array<{
    date: string;
    count: number;
  }>;
}

export interface VideoAccessToken {
  id: string;
  video: number;
  name: string;
  description: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
  url: string;
}
