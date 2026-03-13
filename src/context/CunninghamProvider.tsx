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
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsThemeSelected(true);
  }, []);

  useEffect(() => {
    if (!isThemeSelected) return;
    localStorage.setItem("pod_theme", theme);
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
