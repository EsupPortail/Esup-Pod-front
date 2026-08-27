/**
 * Default block configurations for the homepage.
 *
 * These are sent to the API at startup via POST /api/layout/blocks/sync-defaults/
 * using `get_or_create` semantics — admin customisations are NEVER overwritten.
 *
 * To add a new default block to the homepage:
 * 1. Create your block component + manifest in /components/blocks/
 * 2. Register it in BlockRegistry.ts
 * 3. Add its default config here
 */

export interface DefaultBlockConfig {
  frontend_id: string;
  admin_name: string;
  order: number;
  display_title?: string;
  item_limit?: number;
  extra_config?: Record<string, any>;
}

export const defaultBlocks: DefaultBlockConfig[] = [
  {
    frontend_id: "welcome-banner-block",
    admin_name: "Bandeau d'accueil (défaut)",
    order: 10,
    display_title: "",
    item_limit: 1,
    extra_config: {},
  },
  {
    frontend_id: "action-buttons-block",
    admin_name: "Boutons d'actions rapides (défaut)",
    order: 20,
    display_title: "",
    item_limit: 1,
    extra_config: {},
  },
  {
    frontend_id: "presentation-video-block",
    admin_name: "À la Une — Vidéo Hero (défaut)",
    order: 30,
    display_title: "webtv.featured",
    item_limit: 1,
    extra_config: { order_by: "-created_at" },
  },
  {
    frontend_id: "live-block",
    admin_name: "Événements en Direct (défaut)",
    order: 40,
    display_title: "webtv.liveTitle",
    item_limit: 5,
    extra_config: { order_by: "start_date" },
  },
  {
    frontend_id: "collection-block",
    admin_name: "Nos Chaînes et Thématiques (défaut)",
    order: 50,
    display_title: "webtv.channelsAndThemes",
    item_limit: 5,
    extra_config: { collection_type: "channel" },
  },
  {
    frontend_id: "video-grid-block",
    admin_name: "Dernières Vidéos (défaut)",
    order: 60,
    display_title: "webtv.latestVideos",
    item_limit: 10,
    extra_config: { order_by: "-created_at" },
  },
];
