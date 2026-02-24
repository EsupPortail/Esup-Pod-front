"use client";
import { useContext, createContext, useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

type SidebarContextValue = {
  sidebarOpen: boolean;
  sidebarFixed: boolean;
  handleFixSidebar: () => void;
  handleViewSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

export default function SidebarProvider(props: any) {
  //Comportement sidebar:
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

  // si la taille d'écran change après le mount
  useEffect(() => {
    setSideBarOpen(!isMobile);
    setSideBarFixed(!isMobile);
  }, [isMobile]);

  const handleFixSidebar = () => {
    setSideBarOpen(!sidebarOpen);
    if (!isMobile) {
      setSideBarFixed(!sidebarFixed);
    }
  };

  const handleViewSidebar = () => {
    if (!sidebarFixed) {
      sidebarOpen ? setSideBarOpen(false) : setSideBarOpen(true);
    }
  };

  return (
    <SidebarContext.Provider
      value={{ handleViewSidebar, handleFixSidebar, sidebarOpen, sidebarFixed }}
    >
      {props.children}
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
