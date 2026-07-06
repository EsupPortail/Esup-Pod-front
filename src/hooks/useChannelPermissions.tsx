// src/hooks/useChannelPermissions.tsx
import { useCallback } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import type { Channel } from "@/src/types";

export function useChannelPermissions() {
  const { user } = useAuth();
  const userId = user?.id;

  const getPermissions = useCallback(
    (channel: Channel | null) => {
      if (!userId || !channel) {
        return { isOwner: false, isCollaborator: false };
      }

      const isOwner = channel.owner === userId;
      const isCollaborator = channel.colloborators?.includes(userId);

      return { isOwner, isCollaborator };
    },
    [userId],
  );

  return { getPermissions };
}
