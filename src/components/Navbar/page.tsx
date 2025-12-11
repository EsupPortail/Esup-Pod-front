"use client";
import React, { useState } from "react";
import { Button, Input } from "@openfun/cunningham-react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import styles from "./page.module.css";
import SideBar from "../Sidebar/page";

export default function Navbar() {
  //Comportement sidebar:
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const handleViewSidebar = () => {
    setSideBarOpen(!sidebarOpen);
  };

  //Comportement menu profil:
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.navbar_item}>
          <button
            type="button"
            aria-label="Menu principal"
            onClick={handleViewSidebar}
            className={styles.navbar_button}
          >
            <span className="material-icons">menu</span>
          </button>
        </div>
        <div className="">
          <a className={styles.navbar_logo}>
            <img className="pr-sm pl-sm" src="logoEsup.svg" alt="Accueil"></img>
            <strong>Esup.POD</strong>
          </a>
        </div>
        <div className={styles.navbar_search}>
          <Input
            icon={<span className="material-icons">search</span>}
            fullWidth
            label="Rechercher ..."
          />
        </div>
        <div className={styles.navbar_add_video}>
          <Button
            icon={<span className="material-icons">play_circle</span>}
            iconPosition="right"
            variant="primary"
            size="medium"
          >
            Ajouter une vidéo
          </Button>
        </div>
        <div className={styles.navbar_profil}>
          <IconButton
            onClick={handleClickMenu}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={openMenu ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
          >
            <Avatar sx={{ width: 45, height: 45 }}>AL</Avatar>
          </IconButton>
        </div>
        <Menu
          className={styles.navbar_profil_menu}
          anchorEl={anchorEl}
          id="account-menu"
          open={openMenu}
          onClose={handleCloseMenu}
          onClick={handleCloseMenu}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                padding: "10px",
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <span className={styles.navbar_profil_menu_name_user}>
            Alice LANGLOIS
          </span>
          <div className={styles.navbar_profil_menu_item}>
            <MenuItem onClick={handleCloseMenu}>
              <span className="material-icons">panorama</span>
              Changer mon image de profil
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <span className="material-icons">settings</span>
              Affichage et accessibilité
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <span className="material-icons">logout</span>
              Déconnexion
            </MenuItem>
          </div>
        </Menu>
      </nav>
      <SideBar isOpen={sidebarOpen} />
    </div>
  );
}
