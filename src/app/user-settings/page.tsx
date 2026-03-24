"use client";
import { Switch } from "@openfun/cunningham-react";
import { useCunninghamTheme } from "../../context/CunninghamProvider";

export const breadcrumbLabel = "Affichage et accessibilité";

export default function userSettings() {
  const { theme, handleTheme } = useCunninghamTheme();
  // src/app/user/user-settings/page.tsx

  return (
    <div>
      <h1>Affichage et accessibilité</h1>
      <Switch
        label="Passer en mode sombre"
        labelSide="right"
        checked={theme === "dark"}
        onChange={handleTheme}
      />
    </div>
  );
}
