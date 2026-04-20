"use client";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Link from "next/link";
import styles from "./page.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { User } from "@/src/types/interface";
import { getRoutes } from "@/src/api/routes";
import { getUserDisplayName } from "@/src/utils/helper";

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
      {isMobile && (
        <Button className={styles.button_close} onClick={onClose}>
          <span className="material-icons">close</span>
        </Button>
      )}
      <span className={styles.navbar_profil_menu_name_user}>
        {getUserDisplayName(user)}
      </span>
      <div className={styles.navbar_profil_menu_content}>
        <MenuItem
          className={styles.navbar_profil_menu_item}
          component={Link}
          href="/profile-picture"
        >
          <span className="material-icons">panorama</span>
          Changer mon image de profil
        </MenuItem>
        {user.is_staff && (
          <MenuItem
            className={styles.navbar_profil_menu_item}
            component={Link}
            href={getRoutes().administration}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-icons">admin_panel_settings</span>
            Administration
          </MenuItem>
        )}
        <MenuItem className={styles.navbar_profil_menu_item} onClick={onLogout}>
          <span className="material-icons">logout</span>
          Déconnexion
        </MenuItem>
      </div>
    </div>
  );
}
