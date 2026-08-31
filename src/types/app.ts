export interface AppConfig {
  authentication?: {
    use_local_auth: boolean;
    use_cas: boolean;
    use_ldap: boolean;
    use_shib: boolean;
    use_oidc: boolean;
    oidc_name: string;
    shibboleth_name: string;
    hide_username: boolean;
    use_establishment_field: boolean;
  };
  video?: {
    use_stats_view: boolean;
    view_stats_auth: boolean;
    user_video_category: boolean;
    webtv_mode: boolean;
    use_duplicate: boolean;
    use_hyperlinks: boolean;
    use_video_access_token: boolean;
    use_cut: boolean;
    use_dublin_core: boolean;
    use_marker_time: boolean;
    allow_authenticated_upload: boolean;
    active_video_comment: boolean;
    show_views: boolean;
    use_bulk_actions: boolean;
    default_license: string;
    channel_mode: boolean;
    hide_user_filter: boolean;
    hide_tags: boolean;
    force_lowercase_tags: boolean;
    max_tag_length: number;
    number_tags_cloud: number;
    hide_share: boolean;
    hide_disciplines: boolean;
    hide_cursus: boolean;
    hide_types: boolean;
    restrict_edit_to_staff: boolean;
    homepage_shows_passworded: boolean;
    delete_source_on_video_delete: boolean;
    metadata_languages: { value: string; label: string }[];
    metadata_licenses: { value: string; label: string }[];
    metadata_cursus: { value: string; label: string }[];
  };
  notes?: {
    use_notes: boolean;
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
    can_change_channel_owner: boolean;
    default_channel_image: string;
    default_channel_banner: string;
    use_categories: boolean;
    theme_mandatory: boolean;
    max_theme_depth: number;
    show_empty_themes: boolean;
    owner_can_manage_themes: boolean;
    use_playlists: boolean;
    playlist_max_videos: number;
    allow_public_playlists: boolean;
    use_favorites: boolean;
    default_visibility: string;
    use_password_protection: boolean;
    collections_per_page: number;
    default_collection_order_field: string;
  };
  dressing?: {
    use_dressing: boolean;
    allow_user_custom_dressing: boolean;
    max_watermark_size_mb: number;
    max_credits_duration_seconds: number;
    default_watermark_opacity: number;
    default_watermark_position: string;
  };
  search?: {
    search_results_per_page: number;
    search_min_query_length: number;
    search_max_page: number;
    search_enable_facets: boolean;
    search_enable_suggestions: boolean;
  };
  live?: {
    use_live: boolean;
    use_live_transcription: boolean;
    heartbeat_delay: number;
    default_event_thumbnail: string;
  };
  import_video?: {
    use_import_video: boolean;
    restrict_to_staff: boolean;
    max_video_size_gb: number;
  };
  [key: string]: unknown;
}
export interface AppInfo {
  project: string;
  version: string;
}
