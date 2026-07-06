import { useMemo } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import type { Playlist } from "@/src/types";

export function usePlaylistPermissions(playlist: Playlist | null) {
  const { user } = useAuth();
  const userId = user?.id;

  return useMemo(() => {
    const isOwner = userId != null && playlist?.owner === userId;

    return {
      isOwner,
    };
  }, [userId, playlist?.owner]);
}
