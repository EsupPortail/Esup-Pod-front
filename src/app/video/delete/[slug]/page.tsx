"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import { useVideos } from "@/src/hooks/useVideos";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import styles from "./styles.module.css";
import { useVideoPermissions } from "@/src/hooks/useVideoPermission";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";

export const breadcrumbLabel = "Supprimer la vidéo";

export default function DeleteVideoPage() {
  const router = useRouter();
  const params = useParams();
  const getVideoSlug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { video, useVideoLoading, useVideoError, fetchOne, deleteVideo } =
    useVideos();
  const { isOwnerOrCoOwner } = useVideoPermissions(video);

  useEffect(() => {
    if (!getVideoSlug) return;
    fetchOne(getVideoSlug);
  }, [getVideoSlug, fetchOne]);

  useEffect(() => {
    if (!video) return;
  });

  const handleDelete = async () => {
    if (!getVideoSlug) return;
    const success = await deleteVideo(getVideoSlug);

    if (success) {
      router.push("/video");
      router.refresh();
    }
  };

  if (!mounted || isInitializing || !isAuthenticated) {
    return <CenteredLoader />;
  }

  return (
    <div className={styles.delete_container}>
      <Paper sx={{ p: 4, maxWidth: 520, width: "100%" }}>
        <h2>Supprimer la vidéo</h2>

        {useVideoLoading && !video && <CenteredLoader />}

        {useVideoError ? (
          <div>
            <Alert type={VariantType.ERROR} className={styles.delete_alert}>
              {useVideoError ?? "Vidéo introuvable."}
            </Alert>
            <Button
              variant="bordered"
              onClick={() => router.back()}
              disabled={useVideoLoading}
            >
              Annuler
            </Button>
          </div>
        ) : !isOwnerOrCoOwner ? (
          <Alert type={VariantType.ERROR} className={styles.delete_alert}>
            Vous ne pouvez pas accéder à cette page
          </Alert>
        ) : video ? (
          <>
            <p>
              Etes-vous sûr.e de vouloir supprimer la vidéo{" "}
              <strong>{video.title}</strong> ? <br />
              Cette action est définitive.
            </p>

            <div className={styles.buttons_action}>
              <Button
                color="brand"
                variant="secondary"
                type="reset"
                onClick={() => router.back()}
                disabled={useVideoLoading}
              >
                Annuler
              </Button>

              <Button
                color="error"
                variant="primary"
                type="button"
                onClick={handleDelete}
                disabled={useVideoLoading}
              >
                Supprimer la vidéo
              </Button>
            </div>
          </>
        ) : null}
      </Paper>
    </div>
  );
}
