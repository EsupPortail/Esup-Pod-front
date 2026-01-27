"use client";
import { useContext, useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { SidebarContext } from "../../context/SidebarProvider";
import styles from "./page.module.css";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import MenuItem from "./menuItem";
import { List } from "@mui/material";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { DashboardRounded } from "@mui/icons-material";

const SideBar = () => {
  const { handleViewSidebar, sidebarOpen } = useContext(SidebarContext);

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
      className={styles.sidebar}
      style={{ width: sidebarOpen ? "275px" : "70px" }}
      onMouseEnter={handleViewSidebar}
      onMouseLeave={handleViewSidebar}
    >
      <div className={styles.menu}>
        <h3
          className={styles.menu_title}
          style={{ color: sidebarOpen ? "#1167D4" : "white" }}
        >
          Menu principal
        </h3>
        <List component="nav" className="" disablePadding>
          {menuPrincipalItems.map((item, index) => (
            <MenuItem {...item} key={index} />
          ))}
        </List>
      </div>
      <Divider />
      <div>
        <h3
          className={styles.menu_title}
          style={{ color: sidebarOpen ? "#1167D4" : "white" }}
        >
          Mon menu POD
        </h3>
        <List component="nav" className="" disablePadding>
          {menuPodItems.map((item, index) => (
            <MenuItem {...item} key={index} />
          ))}
        </List>
      </div>
    </div>
  );
};

export default SideBar;
