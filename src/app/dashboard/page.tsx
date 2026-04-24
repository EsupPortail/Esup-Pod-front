"use client";
import PaginateVideos from "@/src/components/PaginateVideos/page";
import { Loader, Alert } from "@openfun/cunningham-react";
import { useVideos } from "@/src/hooks/useVideos";
import { useAuth } from "@/src/context/AuthProvider";
import { useEffect } from "react";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";

export const breadcrumbLabel = "Tableau de bord";

export default function Dashboard() {
  const { fetchVideoUser, videos, error, loading } = useVideos();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { user } = useAuth();

  useEffect(() => {
    // fetchVideoUser seulement quand l’auth est ok
    // pour éviter erreur 401 au refresh.
    if (!mounted || isInitializing || !isAuthenticated) {
      return;
    }
    fetchVideoUser();
  }, [fetchVideoUser, mounted, isInitializing, isAuthenticated]);

  if (!mounted || isInitializing || !isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h1>Mon tableau de bord</h1>
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
      ) : videos.length === 0 ? (
        <p>Aucune vidéo trouvée.</p>
      ) : (
        <div>
          <p>{videos.length} vidéos trouvées</p>
          <PaginateVideos videos={videos} currentUserId={user?.id} />
        </div>
      )}
    </div>
  );
}
