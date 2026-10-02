"use client";

import { Switch } from "@openfun/cunningham-react";
import { useCunninghamTheme } from "@/src/context/CunninghamProvider";
import { useTranslation } from "@/src/hooks/useTranslation";
import { LanguageSelector } from "@/src/components/Language/LanguageSelector";
import styles from "./styles.module.css";

export const breadcrumbLabel = "Affichage et accessibilité";

export default function UserSettings() {
  const { theme, handleTheme } = useCunninghamTheme();
  const { t } = useTranslation();

  return (
    <div className={styles["content-box"]}>
      <h1 className={styles["title"]}>{t("preferences.title")}</h1>

      {/* Section 1: Application language */}
      <div>
        <h2 className={styles["subtitle"]}>
          {t("preferences.languageSectionTitle")}
        </h2>
        <p className={styles["desc"]}>{t("preferences.languageSelectLabel")}</p>
        <LanguageSelector />
      </div>

      {/* Section 2: Visual theme */}
      <div>
        <h2 className={styles["subtitle"]}>
          {t("preferences.themeSectionTitle")}
        </h2>
        <Switch
          label={t("preferences.darkModeLabel")}
          labelSide="right"
          checked={theme === "dark"}
          onChange={handleTheme}
        />
      </div>
    </div>
  );
}
