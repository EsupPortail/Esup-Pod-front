"use client";
import { Switch } from "@openfun/cunningham-react";
import { useCunninghamTheme } from "../../context/CunninghamProvider";

export const breadcrumbLabel = "Affichage et accessibilité";

export default function userSettings() {
  const { theme, handleTheme } = useCunninghamTheme();
  // src/app/user/user-settings/page.tsx

  return (
    <div>
      <h3>Affichage et accessibilité</h3>
      <Switch
        label="Passer en mode sombre"
        labelSide="right"
        checked={theme === "dark"}
        onClick={handleTheme}
      />
    </div>
  );
}
