"use client";
import { useContext, createContext, useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const SIDEBAR_FIXED_STORAGE_KEY = "sidebar-fixed";

type SidebarContextValue = {
  sidebarOpen: boolean;
  sidebarFixed: boolean;
  handleFixSidebar: () => void;
  handleViewSidebar: (open: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

export default function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Comportement sidebar
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [sidebarFixed, setSideBarFixed] = useState(false);

  useEffect(() => {
    const main = document.getElementById("main");
    const footer = document.getElementById("footer");

    if (main && footer) {
      if (!sidebarFixed) {
        main.classList.remove("sidebarFixed");
        footer.classList.remove("sidebarFixed");
      } else {
        main.classList.add("sidebarFixed");
        footer.classList.add("sidebarFixed");
      }
    }
  }, [sidebarFixed]);

  useEffect(() => {
    if (isMobile) {
      setSideBarOpen(false);
      setSideBarFixed(false);
      return;
    }

    const savedValue = localStorage.getItem(SIDEBAR_FIXED_STORAGE_KEY);
    const nextSidebarFixed = savedValue === null ? true : savedValue === "true";

    setSideBarFixed(nextSidebarFixed);
    setSideBarOpen(nextSidebarFixed);
  }, [isMobile]);

  // Desktop only: persist fixed state
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem(SIDEBAR_FIXED_STORAGE_KEY, String(sidebarFixed));
    }
  }, [isMobile, sidebarFixed]);

  const handleFixSidebar = () => {
    if (!isMobile) {
      setSideBarOpen((prev) => !prev);
      setSideBarFixed((prev) => !prev);
      return;
    }

    setSideBarOpen((prev) => !prev);
  };

  const handleViewSidebar = (open: boolean) => {
    if (!sidebarFixed) {
      setSideBarOpen(open);
    }
  };

  return (
    <SidebarContext.Provider
      value={{ handleViewSidebar, handleFixSidebar, sidebarOpen, sidebarFixed }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar doit etre utilise dans SidebarProvider.");
  }
  return ctx;
};
