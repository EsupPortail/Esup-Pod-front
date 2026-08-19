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
  const [theme, setTheme] = useState("default");
  const [isThemeSelected, setIsThemeSelected] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("pod_theme");
    const initialTheme = savedTheme ?? "default";
    setTheme(initialTheme);
    setIsThemeSelected(true);

    if (typeof document !== "undefined") {
      if (initialTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.classList.add("cunningham-theme--dark");
        document.body.classList.add("dark-mode");
      } else {
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.classList.remove("cunningham-theme--dark");
        document.body.classList.remove("dark-mode");
      }
    }
  }, []);

  useEffect(() => {
    if (!isThemeSelected) return;
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
  }, [theme, isThemeSelected]);

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
  if (!ctx) {
    throw new Error(
      "useCunninghamTheme doit etre utilise dans CunninghamStyleProvider.",
    );
  }
  return ctx;
};
