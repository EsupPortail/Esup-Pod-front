import { breadcrumbLabel as labelLoginPage } from "@/src/app/login/LoginClientPage";
import { breadcrumbLabel as labelSettingsPage } from "@/src/app/user-settings/preferences/page";
import { breadcrumbLabel as labelProfilPicturePage } from "@/src/app/profile-picture/page";
import { breadcrumbLabel as labelVideosPage } from "@/src/app/video/VideosClientPage";
import { breadcrumbLabel as labelAddVideosPage } from "@/src/app/video/add/page";
import { breadcrumbLabel as labelEditVideosPage } from "@/src/app/video/edit/[slug]/page";
import { breadcrumbLabel as labelDashboard } from "@/src/app/dashboard/DashboardClientPage";
import { breadcrumbLabel as labelDeleteVideoPage } from "@/src/app/video/delete/[slug]/page";
import { breadcrumbLabel as labelChannelsPage } from "@/src/app/channel/page";
import { breadcrumbLabel as labelChannelDetailPage } from "@/src/app/channel/[channelSlug]/page";
import { breadcrumbLabel as labelPlaylistsPage } from "@/src/app/playlist/PlaylistClientPage";
import { breadcrumbLabel as labelAddPlaylistPage } from "@/src/app/playlist/add/page";
import { breadcrumbLabel as labelDeletePlaylistPage } from "@/src/app/playlist/delete/[slug]/page";
import { breadcrumbLabel as labelMyPlaylistsPage } from "@/src/app/playlist/me/page";
import { breadcrumbLabel as labelEditPlaylistsPage } from "@/src/app/playlist/edit/[slug]/page";
import { breadcrumbLabel as labelThemePage } from "@/src/app/channel/[channelSlug]/[...themeSlug]/page";
import { breadcrumbLabel as labelFavoritesPage } from "@/src/app/favorites/page";

/*Labels qui apparaitront dans le breadcrumb selon l'url*/
export const breadcrumbLabels: Record<string, string> = {
  "/user-settings": labelSettingsPage,
  "/login": labelLoginPage,
  "/profile-picture": labelProfilPicturePage,
  "/video": labelVideosPage,
  "/video/add": labelAddVideosPage,
  "/video/edit": labelEditVideosPage,
  "/dashboard": labelDashboard,
  "/video/delete": labelDeleteVideoPage,
  "/channel": labelChannelsPage,
  "/channel/[channelSlug]": labelChannelDetailPage,
  "/channel/[channelSlug]/[...themeSlug]": labelThemePage,
  "/playlist": labelPlaylistsPage,
  "/playlist/add": labelAddPlaylistPage,
  "/playlist/edit": labelEditPlaylistsPage,
  "/playlist/delete/[slug]": labelDeletePlaylistPage,
  "/playlist/me": labelMyPlaylistsPage,
  "/favorites": labelFavoritesPage,
};
