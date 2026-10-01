"use client";

import React, { useState } from "react";
import { Button } from "@openfun/cunningham-react";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

import { useCunninghamTheme } from "@/src/context/CunninghamProvider";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Tooltip from "@mui/material/Tooltip";

const appLogo = process.env.NEXT_PUBLIC_APP_LOGO;
const appTitle = process.env.NEXT_PUBLIC_APP_TITLE;
/* ------------------------------------------------------------------ */
/*  Search Form (Dynamically Loaded)                                   */
/* ------------------------------------------------------------------ */
const SearchForm = dynamic(
  () => import("../SearchForm/SearchForm").then((mod) => mod.SearchForm),
  { ssr: false },
);

import { useTranslation } from "@/src/hooks/useTranslation";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Preferences Menu (Unified Preferences Menu - Theme, Language, Settings) */
/* ------------------------------------------------------------------ */
export function PreferencesMenu() {
  const { theme, handleTheme } = useCunninghamTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={t("preferences.settingsHeader")} arrow>
        <IconButton
          onClick={handleClick}
          aria-label={t("preferences.settingsHeader")}
          aria-controls={open ? "preferences-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          size="small"
          sx={{
            color: "var(--text-color, inherit)",
            height: "36px",
            width: "36px",
            borderRadius: "8px",
            border: "1px solid var(--border-color, rgba(140, 140, 140, 0.25))",
            backgroundColor: "rgba(128, 128, 128, 0.05)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(128, 128, 128, 0.12)",
              borderColor: "rgba(128, 128, 128, 0.4)",
            },
          }}
        >
          <SettingsIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </Tooltip>

      <Menu
        id="preferences-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              p: 1,
              mt: 1,
              minWidth: 200,
              borderRadius: "12px",
              backgroundColor: "var(--c--theme--colors--card-bg, #ffffff)",
              color: "var(--text-color, inherit)",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleTheme}
          sx={{ borderRadius: "8px", gap: 1.5, py: 1 }}
        >
          {isDark ? (
            <LightModeOutlinedIcon
              sx={{ fontSize: "1.2rem", color: "#f59e0b" }}
            />
          ) : (
            <DarkModeOutlinedIcon sx={{ fontSize: "1.2rem" }} />
          )}
          <Typography variant="body2" fontWeight={500}>
            {isDark
              ? t("preferences.lightModeLabel")
              : t("preferences.darkModeLabel")}
          </Typography>
        </MenuItem>

        <Box sx={{ px: 1, py: 0.5 }}>
          <LanguageSelector variant="compact" />
        </Box>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          component={Link}
          href="/user-settings"
          onClick={handleClose}
          sx={{ borderRadius: "8px", gap: 1.5, py: 1 }}
        >
          <SettingsIcon sx={{ fontSize: "1.2rem" }} />
          <Typography variant="body2" fontWeight={500}>
            {t("preferences.title")}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Login Button                                                        */
/* ------------------------------------------------------------------ */
export function LoginButton() {
  const { t } = useTranslation();
  return (
    <Link key="login-link" href="/login">
      <Button
        className={styles["navbar-button"]}
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
        <span className={styles["navbar-button-display"]}>
          {t("common.login")}
        </span>
      </Button>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Authenticated User Menu                                             */
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
  const { t } = useTranslation();

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
      <div className={styles["navbar-profil"]}>
        <Tooltip
          title={user.is_staff ? `${user.username} (Admin)` : user.username}
          arrow
        >
          <IconButton
            onClick={handleClickMenu}
            size="small"
            aria-controls={openMenu ? "account-menu" : undefined}
            aria-expanded={openMenu ? "true" : undefined}
            aria-label={t("navbar.openProfileMenu")}
            sx={{
              p: "2px",
              border: user.is_staff
                ? "2px solid #3b82f6"
                : "2px solid transparent",
              borderRadius: "50%",
            }}
          >
            <Avatar src={profilePictureUrl} sx={{ width: 42, height: 42 }}>
              {initial}
            </Avatar>
          </IconButton>
        </Tooltip>
      </div>

      {isMobile ? (
        /* ---- Mobile version: full-screen dialog ---- */
        <Dialog fullScreen open={openMenu} onClose={handleCloseMenu}>
          <ProfileMenuContent
            user={user}
            onClose={handleCloseMenu}
            onLogout={handleLogout}
          />
        </Dialog>
      ) : (
        /* ---- Desktop version: anchored menu ---- */
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
/*  Main Navbar Component                                              */
/* ------------------------------------------------------------------ */
export default function Navbar() {
  const { handleFixSidebar, sidebarOpen } = useSidebar();
  const { accessToken, user, isInitializing } = useAuth();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { config } = useAppConfig();
  const canUpload =
    (config as any)?.video?.allow_authenticated_upload !== false ||
    user?.is_staff;

  return (
    <div>
      <nav className={styles.navbar}>
        {isMobile && isSearchOpen ? (
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <IconButton
              aria-label={t("navbar.closeSearch")}
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
            {/* ------- Main menu open/close button ------- */}
            <div className={styles["navbar-item"]}>
              <button
                type="button"
                aria-label={t("sidebar.mainMenu")}
                onClick={handleFixSidebar}
                className={styles["navbar-button-menu"]}
              >
                {sidebarOpen ? (
                  <MenuOpenIcon aria-hidden="true" />
                ) : (
                  <MenuIcon aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="">
              <Link
                className={styles["navbar-logo"]}
                key="accueil-link"
                href="/"
              >
                {appLogo && (
                  <Image
                    width={100}
                    height={100}
                    className="pr-sm pl-sm"
                    src={appLogo}
                    alt={t("a11y.homeLogo")}
                  />
                )}
                <strong>{appTitle}</strong>
              </Link>
            </div>

            {/* ------------------- Search (desktop) ------------------- */}
            {!isMobile && (
              <div className={styles["navbar-search"]}>
                <SearchForm />
              </div>
            )}

            {/* ------------------- Search (mobile) ------------------- */}
            {isMobile && (
              <div className={styles["navbar-search-mobile"]}>
                <IconButton
                  aria-label={t("navbar.openSearch")}
                  onClick={() => setIsSearchOpen(true)}
                >
                  <span className="material-icons" aria-hidden="true">
                    search
                  </span>
                </IconButton>
              </div>
            )}

            {/* ------------------- "Add a video" button ------------------- */}
            {accessToken && user && !isInitializing && canUpload && (
              <div className={styles["navbar-add-video"]}>
                <Button
                  className={styles["navbar-button"]}
                  icon={<AddCircleOutlineIcon aria-hidden="true" />}
                  iconPosition="right"
                  variant="primary"
                  size="medium"
                  href="/video/add"
                >
                  <span className={styles["navbar-button-display"]}>
                    {t("common.addVideo")}
                  </span>
                </Button>
              </div>
            )}

            {/* ------------------- Utilities (Unified Preferences Menu) ------------------- */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "var(--c--globals--spacings--s)",
                marginRight: "var(--c--globals--spacings--s)",
              }}
            >
              <PreferencesMenu />
            </div>

            {/* ------------------- Auth / login ------------------- */}
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
