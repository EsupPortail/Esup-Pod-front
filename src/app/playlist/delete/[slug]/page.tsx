"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Paper from "@mui/material/Paper";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import { usePlaylist } from "@/src/hooks/usePlaylist";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import styles from "./styles.module.css";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import { useTranslation } from "@/src/hooks/useTranslation";

export const breadcrumbLabel = "Supprimer la liste de lecture";

export default function DeletePlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { t } = useTranslation();
  const {
    playlist,
    usePlaylistLoading,
    usePlaylistError,
    fetchOne,
    deletePlaylist,
  } = usePlaylist();

  useEffect(() => {
    if (!slug) return;
    fetchOne(slug);
  }, [fetchOne, slug]);

  const handleDelete = async () => {
    if (!slug) return;
    const success = await deletePlaylist(slug);
    if (success) {
      router.push("/playlist");
      router.refresh();
    }
  };

  if (!mounted || isInitializing || !isAuthenticated) {
    return <CenteredLoader />;
  }

  return (
    <div className={styles["delete-container"]}>
      <Paper className={styles["paper"]}>
        <h2>Supprimer la liste de lecture</h2>

        {usePlaylistLoading && !playlist && <CenteredLoader />}

        {usePlaylistError ? (
          <div>
            <Alert
              type={VariantType.ERROR}
              className={styles["delete-error-alert"]}
            >
              {usePlaylistError ?? "Playlist introuvable."}
            </Alert>
            <Button
              variant="secondary"
              onClick={() => router.back()}
              disabled={usePlaylistLoading}
            >
              {t("common.cancel")}
            </Button>
          </div>
        ) : playlist ? (
          <>
            <p>
              Êtes-vous sûr·e de vouloir supprimer la playlist{" "}
              <strong>{playlist.title}</strong> ? <br />
              Cette action est définitive.
            </p>

            <div className={styles["buttons-action"]}>
              <Button
                color="brand"
                variant="secondary"
                type="reset"
                onClick={() => router.back()}
                disabled={usePlaylistLoading}
              >
                {t("common.cancel")}
              </Button>

              <Button
                color="error"
                variant="primary"
                type="button"
                onClick={handleDelete}
                disabled={usePlaylistLoading}
              >
                Supprimer la playlist
              </Button>
            </div>
          </>
        ) : null}
      </Paper>
    </div>
  );
}
