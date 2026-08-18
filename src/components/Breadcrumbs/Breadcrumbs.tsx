"use client";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import styles from "./styles.module.css";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/src/hooks/useTranslation";

export default function Breadcrumb() {
  const { t } = useTranslation();
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  const isVideoEditRoute =
    pathNames.length >= 3 &&
    pathNames[0] === "video" &&
    pathNames[1] === "edit";
  const videoId = isVideoEditRoute ? pathNames[2] : "";

  const isPlaylistEditRoute =
    pathNames.length >= 3 &&
    pathNames[0] === "playlist" &&
    pathNames[1] === "edit";
  const playlistSlug = isPlaylistEditRoute ? pathNames[2] : "";

  // Dynamic breadcrumb label resolver based on active language
  const getDynamicBreadcrumbLabel = (href: string, rawSegment: string): string => {
    switch (href) {
      case "/user-settings":
      case "/user-settings/preferences":
        return t("preferences.title");
      case "/dressing":
        return t("preferences.dressing");
      case "/login":
        return t("common.login");
      case "/video":
        return t("common.videos");
      case "/video/add":
        return t("common.addVideo");
      case "/dashboard":
        return t("sidebar.dashboard");
      case "/favorites":
        return t("sidebar.myFavorites");
      case "/playlist":
        return t("common.playlists");
      case "/playlist/me":
        return t("sidebar.myPlaylists");
      case "/playlist/add":
        return `${t("common.playlist")} (+)`;
      case "/channel":
        return t("common.channels");
      case "/profile-picture":
        return t("navbar.myProfileImage");
      default:
        // Capitalize segment if no explicit translation mapping exists
        return rawSegment.charAt(0).toUpperCase() + rawSegment.slice(1);
    }
  };

  return (
    <Breadcrumbs className={styles.breadcrumb} aria-label="breadcrumb">
      <Link underline="hover" className={styles.breadcrumbLink} href="/">
        {t("common.home")}
      </Link>

      {pathNames.map((segment, index) => {
        if ((isVideoEditRoute || isPlaylistEditRoute) && index === 2) {
          return null;
        }

        let href = `/${pathNames.slice(0, index + 1).join("/")}`;
        let label = getDynamicBreadcrumbLabel(href, segment);

        if (isVideoEditRoute && index === 1) {
          href = `/video/edit/${videoId}`;
          label = `${label} ${videoId}`;
        }
        if (isPlaylistEditRoute && index === 1) {
          href = `/playlist/edit/${playlistSlug}`;
          label = `${label} ${playlistSlug}`;
        }

        return (
          <Link
            key={href}
            underline="hover"
            className={styles.breadcrumbLink}
            href={href}
            aria-current="page"
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
