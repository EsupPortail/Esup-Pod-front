"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Alert,
  Button,
  FileUploader,
  VariantType,
} from "@openfun/cunningham-react";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import { useTranslation } from "@/src/hooks/useTranslation";
import styles from "./styles.module.css";

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
  const { t } = useTranslation();

  const currentPictureUrl = user?.userpicture
    ? `${BACKEND_URL.replace(/\/$/, "")}/${user.userpicture.replace(/^\//, "")}`
    : null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 1) New handler in the component
  const handleDeletePicture = async () => {
    setError(null);
    setSuccess(null);

    if (!user) {
      setError(t("errors.notConnected"));
      return;
    }

    setIsSubmitting(true);
    try {
      const pictureUrl = getRoutes().auth.user.picture(user.id);

      // Deletion via the API
      const res = await authFetch(pictureUrl, {
        method: "DELETE",
        accessToken,
        onRefresh: refresh,
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || t("errors.imageDeleteError"));
      }

      setSuccess(t("a11y.deleteProfilePictureSuccess"));
      await reloadAuthData();
      setFile(null);
      setPreviewUrl(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("errors.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      setError(t("errors.notConnected"));
      return;
    }
    if (!file) {
      setError(t("errors.chooseImage"));
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
        throw new Error(message || t("errors.imageSendError"));
      }

      if (res.status === 200) {
        setSuccess(t("a11y.newProfilePictureSuccess"));
      }
      setFile(null);
      setPreviewUrl(null);
      await reloadAuthData();
      setFile(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("errors.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{t("a11y.changeProfilePicture")}</h1>
      {error && (
        <Alert canClose type={VariantType.ERROR}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert canClose type={VariantType.SUCCESS}>
          {success}
        </Alert>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles["picture-form"]}>
          <div className={styles["picture-preview"]}>
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={t("a11y.profilePreview")}
                width={160}
                height={160}
                unoptimized
              />
            ) : user?.userpicture ? (
              <Image
                src={currentPictureUrl!}
                alt={t("a11y.currentProfilePicture")}
                width={160}
                height={160}
                unoptimized
              />
            ) : (
              !isInitializing && (
                <Alert type={VariantType.INFO}>
                  {t("a11y.noProfilePicture")}
                </Alert>
              )
            )}
          </div>
          <FileUploader
            bigText={t("a11y.chooseImage")}
            fullWidth={true}
            state={error ? "error" : "default"}
            onFilesChange={(event) => {
              const selectedFile = event.target.value?.[0] ?? null;
              setError(null);
              setFile(selectedFile);
              setPreviewUrl(
                selectedFile ? URL.createObjectURL(selectedFile) : null,
              );
            }}
            accept=".jpg, .jpeg, .png, .webp"
            text={
              error
                ? error
                : `${t("a11y.supportedFormats")} jpg, jpeg, png, webp`
            }
          />
          <div></div>
          <Button
            className={styles["submit-button"]}
            fullWidth
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("pending.sending") : t("common.update")}
          </Button>

          {user?.userpicture && (
            <Button
              fullWidth
              variant="secondary"
              type="button"
              disabled={isSubmitting}
              onClick={handleDeletePicture}
            >
              {isSubmitting
                ? t("pending.deleting")
                : t("a11y.deleteProfilePicture")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
