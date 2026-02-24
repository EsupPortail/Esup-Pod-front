"use client";
import { useSidebar } from "../../context/SidebarProvider";
import { useAuth } from "@/src/context/AuthProvider";
import styles from "./page.module.css";
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

const SideBar = () => {
  const { handleFixSidebar, handleViewSidebar, sidebarOpen } = useSidebar();
  const { accessToken } = useAuth();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const menuPrincipalItems = [
    {
      name: "Consulter les vidéos",
      Icon: SlideshowIcon,
      link: "",
      items: [
        {
          name: "Vidéos",
          link: "/",
        },
        {
          name: "Chaines",
          link: "/",
        },
        {
          name: "Listes de lecture",
          link: "/",
        },
        {
          name: "Listes de lecture promues",
          link: "/",
        },
      ],
    },
    {
      name: "Diffusion en direct",
      Icon: LiveTvIcon,
      link: "",
      items: [
        {
          name: "Voir les directs",
          link: "/",
        },
        {
          name: "Programmer un direct BBB",
          link: "/",
        },
        {
          name: "Mes sessions BBB",
          link: "/",
        },
        {
          name: "Revendiquer un enregistrement",
          link: "/",
        },
      ],
    },
  ];

  const menuPodItems = [
    {
      name: "Déposer une vidéo",
      Icon: AddCircleOutlineIcon,
      link: "",
      items: [
        {
          name: "Ajouter une vidéo",
          link: "/",
        },
        {
          name: "Enregistrer une vidéo",
          link: "/",
        },
        {
          name: "Importer une vidéo externe",
          link: "/",
        },
      ],
    },
    {
      name: "Mon espace",
      Icon: AccountBoxIcon,
      link: "",
      items: [
        {
          name: "Mes vidéos favorites",
          link: "/",
        },
        {
          name: "Mes listes de lecture",
          link: "/",
        },
        {
          name: "Mes habillages",
          link: "/",
        },
      ],
    },
    {
      name: "Mon tableau de bord",
      Icon: DashboardRounded,
      link: "",
    },
    {
      name: "Mes réunions",
      Icon: GroupsIcon,
      link: "",
    },
  ];

  return (
    <div
      className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}
      onMouseEnter={isMobile ? undefined : handleViewSidebar}
      onMouseLeave={isMobile ? undefined : handleViewSidebar}
    >
      {isMobile && (
        <Button className={styles.button_close} onClick={handleFixSidebar}>
          <span className="material-icons">close</span>
        </Button>
      )}
      <div className={styles.menu}>
        <h3
          className={styles.menu_title}
          style={{ color: sidebarOpen ? "#1167D4" : "white" }}
        >
          Menu principal
        </h3>
        <List component="nav" disablePadding>
          {menuPrincipalItems.map((item, index) => (
            <MenuItem {...item} key={index} />
          ))}
        </List>
      </div>
      {accessToken && (
        <div className={styles.menu}>
          <Divider />
          <h3
            className={styles.menu_title}
            style={{ color: sidebarOpen ? "#1167D4" : "white" }}
          >
            Mon menu POD
          </h3>
          <List component="nav" disablePadding>
            {menuPodItems.map((item, index) => (
              <MenuItem {...item} key={index} />
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default SideBar;
