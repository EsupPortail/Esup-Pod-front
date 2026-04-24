"use client";
import React, { useState } from "react";
import { Button, Input } from "@openfun/cunningham-react";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from "../../context/AuthProvider";
import { useSidebar } from "../../context/SidebarProvider";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import { setInitial } from "@/src/utils/helper";
import { ProfileMenuContent } from "./ProfileMenuContent";
import dynamic from "next/dynamic";
import { User } from "@/src/types/interface";

const appLogo = process.env.NEXT_PUBLIC_APP_LOGO;
const appTitle = process.env.NEXT_PUBLIC_APP_TITLE;
const backUrl = process.env.NEXT_PUBLIC_BACK_URL ?? "";
const SearchForm = dynamic(
  () => import("../SearchForm/page").then((mod) => mod.SearchForm),
  { ssr: false },
);
//Bouton Connexion
export function LoginButton() {
  return (
    <Link key="login-link" href="/login">
      <Button
        className={styles.navbar_button}
        icon={<span className="material-icons">person</span>}
        iconPosition="right"
        variant="primary"
        size="medium"
        arial-label="Connexion"
      >
        <span className={styles.navbar_button_display}>Connexion</span>
      </Button>
    </Link>
  );
}
//Menu utilisateur Authentifié
export function AuthMenu({
  isMobile,
  user,
}: {
  isMobile: boolean;
  user: User;
}) {
  //Comportement menu profil:
  const router = useRouter();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleCloseMenu();
    logout();
    router.push("/?logout=success");
  };
  const initial = setInitial(user.last_name, user.first_name);
  const profilePictureUrl = user.userpicture
    ? user.userpicture.startsWith("http")
      ? user.userpicture
      : `${backUrl.replace(/\/$/, "")}/${user.userpicture.replace(/^\//, "")}`
    : undefined;
  return (
    <div>
      <div className={styles.navbar_profil}>
        <IconButton
          onClick={handleClickMenu}
          size="small"
          aria-controls={openMenu ? "account-menu" : undefined}
          aria-expanded={openMenu ? "true" : undefined}
        >
          <Avatar src={profilePictureUrl} sx={{ width: 45, height: 45 }}>
            {initial}
          </Avatar>
        </IconButton>
      </div>
      {isMobile ? (
        <Dialog fullScreen open={openMenu} onClose={handleCloseMenu}>
          <ProfileMenuContent
            user={user}
            onClose={handleCloseMenu}
            onLogout={handleLogout}
          />
        </Dialog>
      ) : (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={openMenu}
          onClose={handleCloseMenu}
          onClick={handleCloseMenu}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                backgroundColor: "var(--background)",
                color:
                  "var(--c--contextuals--content--semantic--neutral--primary);",
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
                  bgcolor: "var(--background)",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <ProfileMenuContent
            user={user}
            onClose={handleCloseMenu}
            onLogout={handleLogout}
          />
        </Menu>
      )}
    </div>
  );
}

export default function Navbar() {
  const { handleFixSidebar, sidebarOpen } = useSidebar();
  const { accessToken, user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.navbar_item}>
          <button
            type="button"
            aria-label="Menu principal"
            onClick={handleFixSidebar}
            className={styles.navbar_button_menu}
          >
            {sidebarOpen ? (
              <span className="material-icons">close</span>
            ) : (
              <span className="material-icons">menu</span>
            )}
          </button>
        </div>
        <div className="">
          <Link className={styles.navbar_logo} key="accueil-link" href="/">
            <img className="pr-sm pl-sm" src={appLogo} alt="Accueil"></img>
            <strong>{appTitle}</strong>
          </Link>
        </div>
        {!isMobile && (
          <div className={styles.navbar_search}>
            <SearchForm />
          </div>
        )}
        {isMobile && (
          <div className={styles.navbar_search_mobile}>
            <IconButton
              aria-label="Ouvrir la recherche"
              onClick={() => setIsSearchOpen(true)}
            >
              <span className="material-icons">search</span>
            </IconButton>
            <Dialog
              fullWidth
              maxWidth="sm"
              open={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            >
              <div className={styles.navbar_search_dialog}>
                <SearchForm />
              </div>
            </Dialog>
          </div>
        )}
        {accessToken && (
          <div className={styles.navbar_add_video}>
            <Button
              className={styles.navbar_button}
              icon={<span className="material-icons">add_circle_outline</span>}
              iconPosition="right"
              variant="primary"
              size="medium"
              href="/video/add"
            >
              <span className={styles.navbar_button_display}>
                Ajouter une vidéo
              </span>
            </Button>
          </div>
        )}
        <IconButton
          sx={{ ml: "var(--c--globals--spacings--s)" }}
          aria-label="Affichage et accessibilité"
          component={Link}
          href="/user-settings"
        >
          <SettingsIcon
            sx={{
              fontSize: "var(--c--globals--font--sizes--h1)",
              color:
                "var(--c--contextuals--content--semantic--neutral--primary);",
            }}
          />
        </IconButton>
        {accessToken && user ? (
          <AuthMenu isMobile={isMobile} user={user} />
        ) : (
          <LoginButton />
        )}
      </nav>
    </div>
  );
}
