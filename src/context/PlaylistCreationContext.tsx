"use client";

import { createContext, useContext, useState } from "react";
import type { Playlist } from "@/src/types";
import { useTranslation } from "../hooks/useTranslation";

type PlaylistCreationContextValue = {
  lastCreatedPlaylist: Playlist | null;
  setLastCreatedPlaylist: (playlist: Playlist | null) => void;
};

const PlaylistCreationContext = createContext<
  PlaylistCreationContextValue | undefined
>(undefined);

type PlaylistCreationProviderProps = {
  children: React.ReactNode;
};

export function PlaylistCreationProvider({
  children,
}: PlaylistCreationProviderProps) {
  const [lastCreatedPlaylist, setLastCreatedPlaylist] =
    useState<Playlist | null>(null);

  return (
    <PlaylistCreationContext.Provider
      value={{ lastCreatedPlaylist, setLastCreatedPlaylist }}
    >
      {children}
    </PlaylistCreationContext.Provider>
  );
}

export function usePlaylistCreationContext() {
  const ctx = useContext(PlaylistCreationContext);
  const { t } = useTranslation();
  if (!ctx) {
    throw new Error(t("providers.playlistCreation"));
  }
  return ctx;
}
