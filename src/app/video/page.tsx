"use client";
import PaginateVideos from "@/src/components/PaginateVideos/page";
import { Loader, Alert } from "@openfun/cunningham-react";
import { useVideos } from "@/src/hooks/useVideos";
import { useAuth } from "@/src/context/AuthProvider";
import { useEffect, useMemo } from "react";

export const breadcrumbLabel = "Vidéos";

export default function Videos() {
  const { fetchAll, videos, error, loading } = useVideos();
  const { user } = useAuth();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const publicVideos = useMemo(() => {
    return videos.filter(
      (video) => !video.is_auth_required && !video.has_password,
    );
  }, [videos]);

  return (
    <div>
      <h1>Vidéos</h1>
      {error && (
        <Alert canClose type="error">
          {error}
        </Alert>
      )}

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : publicVideos.length === 0 ? (
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
