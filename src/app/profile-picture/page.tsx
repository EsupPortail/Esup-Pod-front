"use client";

import { useEffect, useState } from "react";
import { Alert, Button, FileUploader } from "@openfun/cunningham-react";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import styles from "./page.module.css";

export const breadcrumbLabel = "Changer ma photo de profil";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACK_URL ?? "";

export default function UserProfilePicture() {
  const { user, accessToken, refresh, reloadAuthData, isInitializing } =
    useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPictureUrl = user?.userpicture
    ? `${BACKEND_URL.replace(/\/$/, "")}/${user.userpicture.replace(/^\//, "")}`
    : null;

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // 1) Nouvel handler dans le composant
  const handleDeletePicture = async () => {
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("Utilisateur non connecté.");
      return;
    }

    setIsSubmitting(true);
    try {
      const pictureUrl = getRoutes().auth.user.picture(user.id);

      // Suppression côté API
      const res = await authFetch(pictureUrl, {
        method: "DELETE",
        accessToken,
        onRefresh: refresh,
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Échec de la suppression de l'image.");
      }

      setSuccess("Photo de profil supprimée avec succès.");
      await reloadAuthData();
      setFile(null);
      setPreviewUrl(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("Utilisateur non connecté.");
      return;
    }
    if (!file) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const buildPictureFormData = () => {
        const formData = new FormData();
        formData.append("picture", file);
        return formData;
      };

      const pictureUrl = getRoutes().auth.user.picture(user.id);
      let res = await authFetch(pictureUrl, {
        method: "PATCH",
        body: buildPictureFormData(),
        accessToken,
        onRefresh: refresh,
      });

      if (res.status === 404 || res.status === 405) {
        res = await authFetch(pictureUrl, {
          method: "POST",
          body: buildPictureFormData(),
          accessToken,
          onRefresh: refresh,
        });
      }

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Echec de l'envoi de l'image.");
      }

      if (res.status === 200) {
        setSuccess("Image de profil mise a jour avec succès ! 🥳");
        setFile(null);
      }
      await reloadAuthData();
      setFile(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Changer mon image de profil</h1>
      {error && (
        <Alert canClose type="error">
          {error}
        </Alert>
      )}
      {success && (
        <Alert canClose type="success">
          {success}
        </Alert>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.picture_form}>
          <div className={styles.picture_preview}>
            {previewUrl ? (
              <img src={previewUrl} alt="Apercu" width={160} height={160} />
            ) : user?.userpicture ? (
              <img
                src={currentPictureUrl}
                alt="Photo actuelle"
                width={160}
                height={160}
              />
            ) : (
              !isInitializing && (
                <Alert type="info">
                  Vous n'avez pas encore de photo de profil.
                </Alert>
              )
            )}
          </div>
          <FileUploader
            bigText="Ajouter une photo de profil"
            fullWidth={true}
            state={error ? "error" : "default"}
            onFilesChange={(event) => {
              const selectedFile = event.target.value?.[0] ?? null;
              setError(null);
              setFile(selectedFile);
            }}
            accept=".jpg, .jpeg, .png, .webp"
            text={
              error ? error : <p>Formats supportés: jpg, jpeg, png, webp</p>
            }
          />
          <div></div>
          <Button
            className={styles.submit_button}
            fullWidth
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi..." : "Mettre à jour"}
          </Button>

          {user?.userpicture && (
            <Button
              fullWidth
              variant="secondary"
              type="button"
              disabled={isSubmitting}
              onClick={handleDeletePicture}
            >
              {isSubmitting ? "Suppression..." : "Supprimer la photo actuelle"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
