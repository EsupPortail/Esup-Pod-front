"use client";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Link from "next/link";
import styles from "./page.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";

type ProfileMenuContentProps = {
  userName: string;
  onClose: () => void;
  onLogout: () => void;
};

export function ProfileMenuContent({
  userName,
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
      <span className={styles.navbar_profil_menu_name_user}>{userName}</span>
      <div className={styles.navbar_profil_menu_content}>
        <MenuItem
          className={styles.navbar_profil_menu_item}
          component={Link}
          href="/profile-picture"
          onClick={onClose}
        >
          <span className="material-icons">panorama</span>
          Changer mon image de profil
        </MenuItem>
        <MenuItem className={styles.navbar_profil_menu_item} onClick={onLogout}>
          <span className="material-icons">logout</span>
          Déconnexion
        </MenuItem>
      </div>
    </div>
  );
}
