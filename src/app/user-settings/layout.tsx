"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles.module.css";
import SettingsIcon from "@mui/icons-material/Settings";
import PaletteIcon from "@mui/icons-material/Palette";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";

export default function UserSettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Préférences", path: "/user-settings/preferences", icon: <SettingsIcon /> },
    { label: "Habillages (Dressing)", path: "/user-settings/dressing", icon: <PaletteIcon /> },
    { label: "Encodage", path: "/user-settings/encoding", icon: <VideoSettingsIcon /> },
    { label: "Tokens API", path: "/user-settings/tokens", icon: <VpnKeyIcon /> },
  ];

  return (
    <div className={styles.settings_container}>
      <aside className={styles.settings_sidebar}>
        <h2 className={styles.settings_title}>Paramètres</h2>
        <nav className={styles.settings_nav}>
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.path);
            return (
              <Link 
                key={tab.path} 
                href={tab.path} 
                className={`${styles.nav_item} ${isActive ? styles.nav_item_active : ""}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className={styles.settings_content}>
        {children}
      </main>
    </div>
  );
}
