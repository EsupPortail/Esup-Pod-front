"use client";

import { Switch } from "@openfun/cunningham-react";
import { useCunninghamTheme } from "@/src/context/CunninghamProvider";
import { useTranslation } from "@/src/hooks/useTranslation";
import { LanguageSelector } from "@/src/components/Language/LanguageSelector";

export const breadcrumbLabel = "Affichage et accessibilité";

export default function UserSettings() {
  const { theme, handleTheme } = useCunninghamTheme();
  const { t } = useTranslation();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "700px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
        {t("preferences.title")}
      </h1>

      {/* Section 1: Langue de l'application */}
      <div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: 0, marginBottom: "0.5rem" }}>
          {t("preferences.languageSectionTitle")}
        </h2>
        <p style={{ fontSize: "0.95rem", marginBottom: "1rem", opacity: 0.85 }}>
          {t("preferences.languageSelectLabel")}
        </p>
        <LanguageSelector />
      </div>

      {/* Section 2: Thème visuel */}
      <div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: 0, marginBottom: "0.75rem" }}>
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
