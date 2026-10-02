"use client";

import { CunninghamProvider } from "@openfun/cunningham-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "../hooks/useTranslation";

type CunninghamThemeContextValue = {
  theme: string;
  handleTheme: () => void;
};

const CunninghamThemeContext = createContext<
  CunninghamThemeContextValue | undefined
>(undefined);

export default function CunninghamStyleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "default";
    return localStorage.getItem("pod_theme") ?? "default";
  });

  useEffect(() => {
    localStorage.setItem("pod_theme", theme);

    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.classList.add("cunningham-theme--dark");
        document.body.classList.add("dark-mode");
      } else {
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.classList.remove("cunningham-theme--dark");
        document.body.classList.remove("dark-mode");
      }
    }
  }, [theme]);

  const handleTheme = useCallback(() => {
    setTheme((currentTheme) =>
      currentTheme === "default" ? "dark" : "default",
    );
  }, []);

  const value = useMemo(
    () => ({
      theme,
      handleTheme,
    }),
    [theme, handleTheme],
  );

  return (
    <CunninghamThemeContext.Provider value={value}>
      <CunninghamProvider theme={theme}>{children}</CunninghamProvider>
    </CunninghamThemeContext.Provider>
  );
}

export const useCunninghamTheme = () => {
  const ctx = useContext(CunninghamThemeContext);
  const { t } = useTranslation();
  if (!ctx) {
    throw new Error(t("providers.cunninghamTheme"));
  }
  return ctx;
};
