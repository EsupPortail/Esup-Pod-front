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
    <header className={styles["header-container"]}>
      <div className={styles["left-section"]}>
        <Link href="/" className={styles["logo-link"]}>
          <span className={`material-icons ${styles["icon-large"]}`}>
            layers
          </span>
          <span>{t("webtv.webtv")}</span>
        </Link>

        <nav>
          <ul className={styles["nav-links"]}>
            <li>
              <Link href="/channel" className={styles["nav-item"]}>
                {t("common.collection")}
              </Link>
            </li>
            <span className={styles["separator"]}>|</span>
            <li>
              <Link href="/video?type=serie" className={styles["nav-item"]}>
                {t("common.series")}
              </Link>
            </li>
            <span className={styles["separator"]}>|</span>
            <li>
              <Link href="/video?discipline=all" className={styles["nav-item"]}>
                {t("common.discipline")}
              </Link>
            </li>
            <span className={styles["separator"]}>|</span>
            <li>
              <Link href="/video" className={styles["nav-item"]}>
                {t("common.allVideos")}
              </Link>
            </li>
            <span className={styles["separator"]}>|</span>
            <li>
              <Link href="/live" className={styles["nav-item"]}>
                {t("common.directs")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles["right-section"]}>
        <LanguageSelector variant="compact" />

        {user && accessToken ? (
          <div className={styles["user-section"]}>
            <span className={styles["username"]}>
              {user.first_name || user.username}
            </span>
            <button onClick={logout} className={styles["login-btn"]}>
              <span className={`material-icons ${styles["icon-small"]}`}>
                logout
              </span>
              {t("common.logout")}
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles["login-btn"]}>
            <span className={`material-icons ${styles["icon-small"]}`}>
              login
            </span>
            {t("common.login")}
          </Link>
        )}

        <button
          onClick={() => setIsSearchOpen(true)}
          className={styles["search-btn"]}
          aria-label={t("common.search")}
        >
          {t("common.search")}
          <span className={`material-icons ${styles["icon-small"]}`}>
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
          className: styles["dialog-paper"],
        }}
      >
        <div className={styles["dialog-content"]}>
          <div className={styles["dialog-header"]}>
            <h3 className={styles["dialog-title"]}>
              {t("webtv.searchContent")}
            </h3>
            <button
              onClick={() => setIsSearchOpen(false)}
              className={styles["dialog-close"]}
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
