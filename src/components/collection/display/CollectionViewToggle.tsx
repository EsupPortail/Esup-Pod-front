"use client";

import { Button } from "@openfun/cunningham-react";
import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import type { CollectionViewToggleProps } from "./types";
import styles from "./styles.module.css";
import { useTranslation } from "@/src/hooks/useTranslation";

export default function CollectionViewToggle({
  view,
  onChange,
}: CollectionViewToggleProps) {
  const { t } = useTranslation();

  return (
    <div className={styles["toggle-wrapper"]}>
      <span className={styles["toggle-label"]}>
        {t("common.displayMode")} :{" "}
      </span>

      <div
        className={styles["toggle-group"]}
        role="tablist"
        aria-label={t("a11y.collectionDisplayMode")}
      >
        <Button
          size="small"
          type="button"
          className={
            view === "cards"
              ? styles["toggle-button-active"]
              : styles["toggle-button"]
          }
          onClick={() => onChange("cards")}
          aria-pressed={view === "cards"}
        >
          <span className={styles["toggle-button-content"]}>
            <GridViewIcon fontSize="small" />
            <span className={styles["toggle-text"]}>
              {t("common.viewCards")}
            </span>
          </span>
        </Button>

        <Button
          size="small"
          type="button"
          className={
            view === "grid"
              ? styles["toggle-button-active"]
              : styles["toggle-button"]
          }
          onClick={() => onChange("grid")}
          aria-pressed={view === "grid"}
        >
          <span className={styles["toggle-button-content"]}>
            <TableRowsIcon fontSize="small" />
            <span className={styles["toggle-text"]}>
              {t("common.viewTable")}
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
}
