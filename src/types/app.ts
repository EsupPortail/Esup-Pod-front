export interface AppConfig {
  authentication?: {
    use_cas: boolean;
    use_local_auth: boolean;
    auth_domains: string[];
    use_ldap: boolean;
    allow_guest_access: boolean;
  };
  video?: {
    enable_downloads: boolean;
    enable_comments: boolean;
    video_max_upload_size_mb: number;
    video_license_choices: { value: string; label: string }[];
    metadata_languages: { value: string; label: string }[];
    metadata_cursus: { value: string; label: string }[];
  };
  encoding?: {
    max_upload_size_gb: number;
    allowed_extensions: string[];
    video_required_fields: string[];
    user_quota_size_gb: number;
  };
  collection?: {
    use_channels: boolean;
    owner_can_manage_channels: boolean;
    user_can_create_channel: boolean;
    use_categories: boolean;
    use_playlists: boolean;
    use_favorites: boolean;
    theme_mandatory: boolean;
  };
  dressing?: {
    use_dressing: boolean;
    allow_user_custom_dressing: boolean;
  };
  [key: string]: unknown;
}

export interface AppInfo {
  project: string;
  version: string;
}
