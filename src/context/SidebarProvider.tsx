"use client";
import { createContext, useState, useEffect } from "react";

export const SidebarContext = createContext([]);

export default function SidebarProvider(props: any) {
  //Comportement sidebar:
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const [sidebarFixed, setSideBarFixed] = useState(true);

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

  const handleFixSidebar = () => {
    setSideBarOpen(!sidebarOpen);
    setSideBarFixed(!sidebarFixed);
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
