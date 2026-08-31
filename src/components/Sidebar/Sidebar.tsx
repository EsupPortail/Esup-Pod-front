"use client";

import { useSidebar } from "../../context/SidebarProvider";
import { useAuth } from "@/src/context/AuthProvider";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import styles from "./styles.module.css";
import Divider from "@mui/material/Divider";
import MenuItem from "./menuItem";
import { List } from "@mui/material";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { DashboardRounded } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "@/src/hooks/useTranslation";

const SideBar = () => {
  const { handleFixSidebar, handleViewSidebar, sidebarOpen } = useSidebar();
  const { accessToken, user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { config } = useAppConfig();
  const { t } = useTranslation();

  /* ----------------------------- *
   *  Menus – données statiques
   * -------------------------------- */
  const publicVideoItems = [
    { name: t("common.allVideos"), link: "/video" },
  ];
  if (config?.collection?.use_channels !== false) {
    publicVideoItems.push({ name: t("common.channels"), link: "/channel" });
  }
  if (config?.collection?.use_playlists !== false) {
    publicVideoItems.push({ name: t("common.playlists"), link: "/playlist" });
  }

  const menuPrincipalItems = [];
  if (publicVideoItems.length === 1) {
    menuPrincipalItems.push({
      name: t("sidebar.browseVideos"),
      Icon: SlideshowIcon,
      link: publicVideoItems[0].link,
    });
  } else if (publicVideoItems.length > 1) {
    menuPrincipalItems.push({
      name: t("sidebar.browseVideos"),
      Icon: SlideshowIcon,
      link: "",
      items: publicVideoItems,
    });
  }

  const mySpaceItems = [];
  if (config?.collection?.use_favorites !== false) {
    mySpaceItems.push({ name: t("sidebar.myFavorites"), link: "/favorites" });
  }
  if (config?.collection?.use_playlists !== false) {
    mySpaceItems.push({ name: t("sidebar.myPlaylists"), link: "/playlist/me" });
  }
  if ((config as any)?.dressing?.use_dressing !== false) {
    mySpaceItems.push({ name: t("sidebar.videoBranding"), link: "/dressing" });
  }

  const menuPodItems: any[] = [
    { name: t("sidebar.dashboard"), Icon: DashboardRounded, link: "/dashboard" },
  ];

  const addVideoItems = [];
  if ((config as any)?.video?.allow_authenticated_upload !== false || user?.is_staff) {
    addVideoItems.push({ name: t("common.addVideo"), link: "/video/add" });
  }

  if (addVideoItems.length === 1) {
    menuPodItems.push({
      name: t("common.addVideo"),
      Icon: AddCircleOutlineIcon,
      link: addVideoItems[0].link,
    });
  } else if (addVideoItems.length > 1) {
    menuPodItems.push({
      name: t("common.addVideo"),
      Icon: AddCircleOutlineIcon,
      link: "",
      items: addVideoItems,
    });
  }

  if (mySpaceItems.length === 1) {
    menuPodItems.push({
      name: mySpaceItems[0].name,
      Icon: AccountBoxIcon,
      link: mySpaceItems[0].link,
    });
  } else if (mySpaceItems.length > 1) {
    menuPodItems.push({
      name: t("sidebar.mySpace"),
      Icon: AccountBoxIcon,
      link: "",
      items: mySpaceItems,
    });
  }

  return (
    <nav
      id="sidebar-nav"
      aria-label={t("sidebar.mainMenu")}
      aria-labelledby="sidebar-title"
      className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed
        }`}
      onMouseEnter={isMobile ? undefined : () => handleViewSidebar(true)}
      onMouseLeave={isMobile ? undefined : () => handleViewSidebar(false)}
    >
      {/* ----- Bouton de fermeture (mobile) ----- */}
      {isMobile && (
        <Button
          className={styles.button_close}
          onClick={handleFixSidebar}
          aria-label={t("sidebar.closeMenu")}
        >
          <CloseIcon aria-hidden="true" />
        </Button>
      )}

      <div className={styles.menu}>
        {accessToken && user ? (
          <>
            <Chip
              label={`${t("sidebar.welcome")} ${user?.first_name || user?.username || "admin"} 👋`}
              sx={{
                display: sidebarOpen ? "inline-flex" : "none",
                backgroundColor: "var(--background-brand-secondary, rgba(59, 130, 246, 0.15))",
                color: "var(--background-brand, #3b82f6)",
                fontWeight: 600,
                fontSize: "0.85rem",
                marginLeft: "14px",
                marginTop: "16px",
                marginBottom: "var(--c--globals--spacings--xs)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
            <List component="nav" disablePadding sx={{ mt: sidebarOpen ? 2 : 1 }}>
              {[...menuPodItems, ...menuPrincipalItems].map((item, index) => (
                <MenuItem {...item} key={index} />
              ))}
            </List>
          </>
        ) : (
          <>
            <h3
              id="sidebar-title"
              className={styles.menu_title}
              style={{
                display: sidebarOpen ? "block" : "none",
                color: "var(--text-color-brand)",
              }}
            >
              {t("sidebar.mainMenu")}
            </h3>
            <List component="nav" disablePadding>
              {menuPrincipalItems.map((item, index) => (
                <MenuItem {...item} key={index} />
              ))}
            </List>
          </>
        )}
      </div>
    </nav>
  );
};

export default SideBar;
