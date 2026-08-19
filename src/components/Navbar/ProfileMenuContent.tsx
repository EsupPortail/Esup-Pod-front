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
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import { useTranslation } from "@/src/hooks/useTranslation";

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
  const { config } = useAppConfig();
  const { t } = useTranslation();

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
        {getUserDisplayName(user, config?.authentication, false)}
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
          {t("navbar.myProfileImage")}
        </MenuItem>

        {/* ----- Mes filigranes / Habillages ----- */}
        {(config as any)?.dressing?.use_dressing !== false && (
          <MenuItem
            className={styles.navbar_profil_menu_item}
            component={Link}
            href="/dressing"
          >
            <PaletteOutlinedIcon
              className={styles.menu_item_icon}
              aria-hidden="true"
            />
            {t("preferences.dressing")}
          </MenuItem>
        )}

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
