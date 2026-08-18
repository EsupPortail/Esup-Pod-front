"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthProvider";
import styles from "./WebTVHeader.module.css";
import Dialog from "@mui/material/Dialog";
import { SearchForm } from "../SearchForm/SearchForm";

import { useTranslation } from "@/src/hooks/useTranslation";
import { LanguageSelector } from "../Language/LanguageSelector";

export default function WebTVHeader() {
  const { user, accessToken, logout } = useAuth();
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logoLink}>
          <span className="material-icons" style={{ fontSize: "1.8rem" }}>
            layers
          </span>
          <span>WebTV</span>
        </Link>

        <nav>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/channel" className={styles.navItem}>
                {t("common.collection")}
              </Link>
            </li>
            <span className={styles.separator}>|</span>
            <li>
              <Link href="/video?type=serie" className={styles.navItem}>
                {t("common.series")}
              </Link>
            </li>
            <span className={styles.separator}>|</span>
            <li>
              <Link href="/video?discipline=all" className={styles.navItem}>
                {t("common.discipline")}
              </Link>
            </li>
            <span className={styles.separator}>|</span>
            <li>
              <Link href="/video" className={styles.navItem}>
                {t("common.allVideos")}
              </Link>
            </li>
            <span className={styles.separator}>|</span>
            <li>
              <Link href="/live" className={styles.navItem}>
                {t("common.directs")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.rightSection}>
        <LanguageSelector variant="compact" />

        {user && accessToken ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
              {user.first_name || user.username}
            </span>
            <button onClick={logout} className={styles.loginBtn}>
              <span className="material-icons" style={{ fontSize: "1.1rem" }}>
                logout
              </span>
              {t("common.logout")}
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.loginBtn}>
            <span className="material-icons" style={{ fontSize: "1.1rem" }}>
              login
            </span>
            {t("common.login")}
          </Link>
        )}

        <button
          onClick={() => setIsSearchOpen(true)}
          className={styles.searchBtn}
          aria-label={t("common.search")}
        >
          {t("common.search")}
          <span className="material-icons" style={{ fontSize: "1.1rem" }}>
            search
          </span>
        </button>
      </div>

      {/* Dialog overlay for search */}
      <Dialog
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            padding: "1.5rem",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
          },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontWeight: 700 }}>Rechercher des contenus</h3>
            <button
              onClick={() => setIsSearchOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          <SearchForm />
        </div>
      </Dialog>
    </header>
  );
}
