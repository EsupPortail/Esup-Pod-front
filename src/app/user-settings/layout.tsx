"use client";

import React from "react";
import styles from "./styles.module.css";

export default function UserSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles["settings-container"]}>{children}</div>;
}
