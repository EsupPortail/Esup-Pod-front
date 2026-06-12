import { useMemo } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import type { Video } from "@/src/types";

export function useVideoPermissions(video: Video | null) {
  const { user } = useAuth();
  const userId = user?.id;

  return useMemo(() => {
    const isOwner = userId != null && video?.owner_id === userId;
    const isCoOwner =
      userId != null && Boolean(video?.co_owners?.includes(userId));

    return {
      isOwner,
      isCoOwner,
      isOwnerOrCoOwner: isOwner || isCoOwner,
      canEdit: isOwner || isCoOwner,
      canManage: isOwner || isCoOwner,
    };
  }, [userId, video?.owner_id, video?.co_owners]);
}
