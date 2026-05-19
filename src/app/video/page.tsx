"use client";
import PaginateVideos from "@/src/components/PaginateVideos/page";
import { Loader, Alert } from "@openfun/cunningham-react";
import { useVideos } from "@/src/hooks/useVideos";
import { useAuth } from "@/src/context/AuthProvider";
import { useEffect, useMemo } from "react";

export const breadcrumbLabel = "Toutes les vidéos";

export default function Videos() {
  const { fetchAll, videos, useVideoError, useVideoLoading } = useVideos();
  const { user } = useAuth();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const publicVideos = useMemo(() => {
    return videos.filter(
      (video) =>
        !video.is_auth_required && !video.has_password && video.status !== "DR",
    );
  }, [videos]);

  return (
    <div>
      <h1>Toutes les vidéos</h1>
      {useVideoError && (
        <Alert canClose type="error">
          {useVideoError}
        </Alert>
      )}

      {useVideoLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : publicVideos.length === 0 && !useVideoLoading ? (
        <Alert>Aucune vidéo trouvée 🥺 </Alert>
      ) : (
        <div>
          <p>{publicVideos.length} vidéos trouvées</p>
          <PaginateVideos videos={publicVideos} currentUserId={user?.id} />
        </div>
      )}
    </div>
  );
}
