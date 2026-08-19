"use client";

import React, { useState } from "react";
import { Button } from "@openfun/cunningham-react";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthProvider";
import { useSidebar } from "../../context/SidebarProvider";
import useMediaQuery from "@mui/material/useMediaQuery";
import styles from "./styles.module.css";
import dynamic from "next/dynamic";
import type { User } from "@/src/types";
import { ProfileMenuContent } from "./ProfileMenuContent";
import { getProfilePictureUrl, setInitial } from "@/src/constants/user";
import { LanguageSelector } from "../Language/LanguageSelector";
import { useAppConfig } from "@/src/hooks/useAppConfig";

const appLogo = process.env.NEXT_PUBLIC_APP_LOGO;
const appTitle = process.env.NEXT_PUBLIC_APP_TITLE;
/* ------------------------------------------------------------------ */
/*  Recherche (chargement dynamique)                                  */
/* ------------------------------------------------------------------ */
const SearchForm = dynamic(
  () => import("../SearchForm/SearchForm").then((mod) => mod.SearchForm),
  { ssr: false },
);

import { useTranslation } from "@/src/hooks/useTranslation";

/* ------------------------------------------------------------------ */
/*  Bouton de connexion                                               */
/* ------------------------------------------------------------------ */
export function LoginButton() {
  const { t } = useTranslation();
  return (
    <Link key="login-link" href="/login">
      <Button
        className={styles.navbar_button}
        icon={
          <span className="material-icons" aria-hidden="true">
            person
          </span>
        }
        iconPosition="right"
        variant="primary"
        size="medium"
        aria-label={t("common.login")}
      >
        <span className={styles.navbar_button_display}>{t("common.login")}</span>
      </Button>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Menu utilisateur authentifié                                      */
/* ------------------------------------------------------------------ */
export function AuthMenu({
  isMobile,
  user,
}: {
  isMobile: boolean;
  user: User;
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    handleCloseMenu();
    logout();
    router.push("/?logout=success");
  };

  const initial = setInitial(user.last_name, user.first_name);
  const profilePictureUrl = getProfilePictureUrl(user.userpicture);

  return (
    <div>
      <div className={styles.navbar_profil}>
        <IconButton
          onClick={handleClickMenu}
          size="small"
          aria-controls={openMenu ? "account-menu" : undefined}
          aria-expanded={openMenu ? "true" : undefined}
          aria-label="Ouvrir le menu du profil"
        >
          <Avatar src={profilePictureUrl} sx={{ width: 45, height: 45 }}>
            {initial}
          </Avatar>
        </IconButton>
      </div>

      {isMobile ? (
        /* ---- Version mobile : dialogue plein écran ---- */
        <Dialog fullScreen open={openMenu} onClose={handleCloseMenu}>
          <ProfileMenuContent
            user={user}
            onClose={handleCloseMenu}
            onLogout={handleLogout}
          />
        </Dialog>
      ) : (
        /* ---- Version desktop : menu ancré ---- */
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
                  "var(--c--contextuals--content--semantic--neutral--primary)",
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

/* ------------------------------------------------------------------ */
/*  Composant principal Navbar                                        */
/* ------------------------------------------------------------------ */
export default function Navbar() {
  const { handleFixSidebar, sidebarOpen } = useSidebar();
  const { accessToken, user, isInitializing } = useAuth();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const { config } = useAppConfig();
  const canUpload = (config as any)?.video?.allow_authenticated_upload !== false || user?.is_staff;

  return (
    <div>
      <nav className={styles.navbar}>
        {isMobile && isSearchOpen ? (
          <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px' }}>
            <IconButton
              aria-label="Fermer la recherche"
              onClick={() => setIsSearchOpen(false)}
            >
              <span className="material-icons" aria-hidden="true">
                arrow_back
              </span>
            </IconButton>
            <div style={{ flexGrow: 1 }}>
              <SearchForm />
            </div>
          </div>
        ) : (
          <>
        {/* ------- Bouton d’ouverture/fermeture du menu principal ------- */}
        <div className={styles.navbar_item}>
          <button
            type="button"
            aria-label="Menu principal"
            onClick={handleFixSidebar}
            className={styles.navbar_button_menu}
          >
            {sidebarOpen ? (
              <CloseIcon aria-hidden="true" />
            ) : (
              <MenuIcon aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="">
          <Link className={styles.navbar_logo} key="accueil-link" href="/">
            <img className="pr-sm pl-sm" src={appLogo} alt="Logo Esup-Pod — Retour à l'accueil" />
            <strong>{appTitle}</strong>
          </Link>
        </div>

        {/* ------------------- Recherche (desktop) ------------------- */}
        {!isMobile && (
          <div className={styles.navbar_search}>
            <SearchForm />
          </div>
        )}

        {/* ------------------- Recherche (mobile) ------------------- */}
        {isMobile && (
          <div className={styles.navbar_search_mobile}>
            <IconButton
              aria-label="Ouvrir la recherche"
              onClick={() => setIsSearchOpen(true)}
            >
              <span className="material-icons" aria-hidden="true">
                search
              </span>
            </IconButton>
          </div>
        )}

        {/* ------------------- Bouton “Ajouter une vidéo” ------------------- */}
        {accessToken && user && !isInitializing && canUpload && (
          <div className={styles.navbar_add_video}>
            <Button
              className={styles.navbar_button}
              icon={<AddCircleOutlineIcon aria-hidden="true" />}
              iconPosition="right"
              variant="primary"
              size="medium"
              href="/video/add"
            >
              <span className={styles.navbar_button_display}>
                {t("common.addVideo")}
              </span>
            </Button>
          </div>
        )}

        {/* ------------------- Sélecteur de langue ------------------- */}
        <div style={{ marginLeft: "var(--c--globals--spacings--s)", display: "flex", alignItems: "center" }}>
          <LanguageSelector variant="compact" />
        </div>

        {/* ------------------- Paramètres / accessibilité ------------------- */}
        <IconButton
          sx={{ ml: "var(--c--globals--spacings--xs)" }}
          aria-label="Affichage et accessibilité"
          component={Link}
          href="/user-settings"
        >
          <SettingsIcon
            aria-hidden="true"
            sx={{
              fontSize: "var(--c--globals--font--sizes--h1)",
              color:
                "var(--c--contextuals--content--semantic--neutral--primary)",
            }}
          />
        </IconButton>

        {/* ------------------- Auth / connexion ------------------- */}
        {accessToken && user ? (
          <AuthMenu isMobile={isMobile} user={user} />
        ) : !isInitializing ? (
          <LoginButton />
        ) : null}
          </>
        )}
      </nav>
    </div>
  );
}
