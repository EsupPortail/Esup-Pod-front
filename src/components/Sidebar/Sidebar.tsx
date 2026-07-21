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

const SideBar = () => {
  const { handleFixSidebar, handleViewSidebar, sidebarOpen } = useSidebar();
  const { accessToken, user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { config } = useAppConfig();

  /* ----------------------------- *
   *  Menus – données statiques
   * -------------------------------- */
  const publicVideoItems = [
    { name: "Toutes les vidéos", link: "/video" },
  ];
  if (config?.collection?.use_channels !== false) {
    publicVideoItems.push({ name: "Chaines", link: "/channel" });
  }
  if (config?.collection?.use_playlists !== false) {
    publicVideoItems.push({ name: "Listes de lecture", link: "/playlist" });
  }

  const menuPrincipalItems = [
    {
      name: "Consulter les vidéos",
      Icon: SlideshowIcon,
      link: "",
      items: publicVideoItems,
    },
  ];

  const mySpaceItems = [];
  if (config?.collection?.use_favorites !== false) {
    mySpaceItems.push({ name: "Mes vidéos favorites", link: "/favorites" });
  }
  if (config?.collection?.use_playlists !== false) {
    mySpaceItems.push({ name: "Mes listes de lecture", link: "/playlist/me" });
  }

  const menuPodItems = [
    { name: "Mon tableau de bord", Icon: DashboardRounded, link: "/dashboard" },
    {
      name: "Déposer une vidéo",
      Icon: AddCircleOutlineIcon,
      link: "",
      items: [
        { name: "Ajouter une vidéo", link: "/video/add" },
      ],
    },
  ];

  if (mySpaceItems.length > 0) {
    menuPodItems.push({
      name: "Mon espace",
      Icon: AccountBoxIcon,
      link: "",
      items: mySpaceItems,
    });
  }

  return (
    <nav
      id="sidebar-nav"
      aria-label="Menu principal"
      aria-labelledby="sidebar-title"
      className={`${styles.sidebar} ${
        sidebarOpen ? styles.open : styles.closed
      }`}
      onMouseEnter={isMobile ? undefined : () => handleViewSidebar(true)}
      onMouseLeave={isMobile ? undefined : () => handleViewSidebar(false)}
    >
      {/* ----- Bouton de fermeture (mobile) ----- */}
      {isMobile && (
        <Button
          className={styles.button_close}
          onClick={handleFixSidebar}
          aria-label="Fermer le menu"
        >
          <CloseIcon aria-hidden="true" />
        </Button>
      )}

      <div className={styles.menu}>
        {accessToken && user ? (
          <>
            <Chip
              label={`Bienvenue ${user?.first_name || user?.username} ! 👋`}
              sx={{
                backgroundColor: sidebarOpen
                  ? "var(--background-brand-secondary)"
                  : "var(--c--globals--colors--gray-000)",
                color: sidebarOpen
                  ? "var(--background-brand)"
                  : "var(--c--globals--colors--gray-000)",
                marginLeft: "14px",
                marginTop: "16px",
                fontSize: "var(--c--globals--font--sizes--md)",
                fontWeight: "var(--c--globals--font--weights--bold)",
                marginBottom: "var(--c--globals--spacings--xs)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
            <List component="nav" disablePadding sx={{ mt: 2 }}>
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
                color: sidebarOpen
                  ? "var(--text-color-brand)"
                  : "var(--c--globals--colors--gray-000)",
              }}
            >
              Menu principal
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
