"use client";

import { createContext, useContext, useState } from "react";
import type { Playlist } from "@/src/types";

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
  if (!ctx) {
    throw new Error(
      "usePlaylistCreationContext doit être utilisé dans PlaylistCreationProvider.",
    );
  }
  return ctx;
}
