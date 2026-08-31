export interface BlockConfig {
  frontend_id: string;
  block_type?: string;
  order: number;
  is_active: boolean;
  display_title?: string;
  subtitle_or_text?: string;
  item_limit: number;
  background_color?: string;
  text_color?: string;
  extra_config?: {
    order_by?: string;
    collection_type?: "channel" | "theme" | "playlist" | "all";
    collection_ids?: (string | number)[];
    type?: string;
    data_type?: string;
    [key: string]: unknown;
  };
}
