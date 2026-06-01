"use client";

import { Button } from "@openfun/cunningham-react";
import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import type { VideoViewToggleProps } from "./types";
import styles from "./styles.module.css";

export default function VideoViewToggle({
  view,
  onChange,
}: VideoViewToggleProps) {
  return (
    <div className={styles.toggleWrapper}>
      <span className={styles.toggleLabel}>Affichage : </span>

      <div
        className={styles.toggleGroup}
        role="tablist"
        aria-label="Mode d'affichage des vidéos"
      >
        <Button
          size="small"
          type="button"
          className={
            view === "cards" ? styles.toggleButtonActive : styles.toggleButton
          }
          onClick={() => onChange("cards")}
          aria-pressed={view === "cards"}
        >
          <span className={styles.toggleButtonContent}>
            <GridViewIcon fontSize="small" />
            <span className={styles.toggleText}>Cartes</span>
          </span>
        </Button>

        <Button
          size="small"
          type="button"
          className={
            view === "grid" ? styles.toggleButtonActive : styles.toggleButton
          }
          onClick={() => onChange("grid")}
          aria-pressed={view === "grid"}
        >
          <span className={styles.toggleButtonContent}>
            <TableRowsIcon fontSize="small" />
            <span className={styles.toggleText}>Tableau</span>
          </span>
        </Button>
      </div>
    </div>
  );
}
