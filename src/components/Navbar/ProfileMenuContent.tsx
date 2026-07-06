"use client";

import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Link from "next/link";
import styles from "./styles.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { User } from "@/src/types";
import { getRoutes } from "@/src/api/routes";
import { getUserDisplayName } from "@/src/constants/user";

import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";

type ProfileMenuContentProps = {
  user: User;
  onClose: () => void;
  onLogout: () => void;
};

export function ProfileMenuContent({
  user,
  onClose,
  onLogout,
}: ProfileMenuContentProps) {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  return (
    <div className={styles.navbar_profil_menu}>
      {/* ---------- Bouton de fermeture (mobile) ---------- */}
      {isMobile && (
        <Button
          className={styles.button_close}
          onClick={onClose}
          aria-label="Fermer le menu"
        >
          <CloseIcon aria-hidden="true" />
        </Button>
      )}

      <span className={styles.navbar_profil_menu_name_user}>
        {getUserDisplayName(user)}
      </span>

      <div className={styles.navbar_profil_menu_content}>
        {/* ----- Modifier l’image de profil ----- */}
        <MenuItem
          className={styles.navbar_profil_menu_item}
          component={Link}
          href="/profile-picture"
        >
          <PanoramaOutlinedIcon
            className={styles.menu_item_icon}
            aria-hidden="true"
          />
          Modifier mon image de profil
        </MenuItem>

        {/* ----- Accès à l’administration (superUser uniquement) ----- */}
        {user.is_superuser && (
          <MenuItem
            className={styles.navbar_profil_menu_item}
            component={Link}
            href={getRoutes().administration}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AdminPanelSettingsOutlinedIcon
              className={styles.menu_item_icon}
              aria-hidden="true"
            />
            Administration
          </MenuItem>
        )}

        {/* ----- Déconnexion ----- */}
        <MenuItem className={styles.navbar_profil_menu_item} onClick={onLogout}>
          <LogoutOutlinedIcon
            className={styles.menu_item_icon}
            aria-hidden="true"
          />
          Déconnexion
        </MenuItem>
      </div>
    </div>
  );
}
