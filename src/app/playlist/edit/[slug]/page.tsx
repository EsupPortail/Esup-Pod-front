"use client";

import { useForm, useWatch, FieldErrors } from "react-hook-form";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/src/components/BackButton/BackButton";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { usePlaylist } from "@/src/hooks/usePlaylist";
import { usePlaylistPermissions } from "@/src/hooks/usePlaylistPermission";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import type { PlaylistRequest } from "@/src/types";
import Link from "next/link";
import styles from "./styles.module.css";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { PlaylistForm } from "@/src/components/collection/PlaylistForm";
import type { CollectionOrder } from "@/src/constants/collection";
import { useTranslation } from "@/src/hooks/useTranslation";

export const breadcrumbLabel = "Éditer la liste de lecture";

type EditPlaylistFormValues = {
  title: string;
  description: string;
  is_public: boolean;
  is_password_required: boolean;
  password: string;
  default_order: CollectionOrder;
};

const FORM_FIELD_LABELS: Partial<Record<keyof EditPlaylistFormValues, string>> =
  {
    title: "Titre",
    description: "Description",
    is_password_required: "Ajouter un mot de passe",
    is_public: "Statut",
    password: "Mot de passe",
    default_order: "Tri par défault",
  };

export default function EditPlaylist() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width: 932px)");
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const {
    playlist,
    fetchOne,
    updatePlaylist,
    usePlaylistLoading,
    usePlaylistError,
  } = usePlaylist();
  const { isOwner } = usePlaylistPermissions(playlist);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setformError] = useState<string | null>(null);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    null | (() => void)
  >(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setValue,
    clearErrors,
  } = useForm<EditPlaylistFormValues>({
    defaultValues: {
      title: "",
      description: "",
      is_public: true,
      password: "",
      default_order: "created_at",
      is_password_required: false,
    },
  });

  const initialValues = useMemo<EditPlaylistFormValues | null>(() => {
    if (!playlist) return null;

    return {
      title: playlist.title ?? "",
      description: playlist.description ?? "",
      is_public: playlist.is_public ?? true,
      password: "",
      default_order: playlist.default_order ?? "created_at",
      is_password_required: playlist.is_protected ?? false,
    };
  }, [playlist]);
  const watchedValues = useWatch({ control });
  const isPublic = watchedValues.is_public ?? true;

  // If the playlist is private, disable the password
  useEffect(() => {
    if (!isPublic) {
      setValue("is_password_required", false);
      setValue("password", "");
      clearErrors("password");
    }
  }, [isPublic, setValue, clearErrors]);

  useEffect(() => {
    if (!slug || !isAuthenticated) return;
    fetchOne(slug);
  }, [fetchOne, isAuthenticated, slug]);

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const hasUnsavedChanges = (() => {
    if (!initialValues) return false;
    return JSON.stringify(initialValues) !== JSON.stringify(watchedValues);
  })();

  /* Alert if the user leaves the page without saving */
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const openConfirmLeave = (navigationAction: () => void) => {
    if (!hasUnsavedChanges) {
      navigationAction();
      return;
    }
    setPendingNavigation(() => navigationAction);
    setConfirmLeaveOpen(true);
  };

  const handleConfirmLeave = () => {
    setConfirmLeaveOpen(false);
    pendingNavigation?.();
  };

  const handleCancelLeave = () => {
    setConfirmLeaveOpen(false);
    setPendingNavigation(null);
  };

  const onSubmit = async (data: EditPlaylistFormValues) => {
    setError(null);
    setSuccess(null);
    const passwordValue = data.password.trim();

    if (!slug) {
      setError(`${t("errors.savingFormError")}`);
      return;
    }

    const payload: PlaylistRequest = {
      title: data.title.trim(),
      description: data.description.trim() || null,
      is_public: data.is_public,
      password: "",
      default_order: data.default_order,
    };

    if (!payload.title) {
      setError(t("common.titleRequired"));
      return;
    }

    // Private playlist: never use a password
    if (!data.is_public) {
      payload.password = "";
    } else {
      // Public playlist: password is optional,
      // but required if the "protect with a password" checkbox is checked
      if (data.is_password_required && !passwordValue) {
        setError(`${t("common.passwordProtected")}`);
        return;
      }

      if (data.is_password_required && passwordValue) {
        payload.password = passwordValue;
      }
    }

    const updated = await updatePlaylist(slug, payload);
    if (updated) {
      setSuccess(`${t("playlists.playlistUpdated")} 🥳`);
    }
  };

  const onInvalid = (formErrors: FieldErrors<EditPlaylistFormValues>) => {
    const fieldNames = Object.keys(formErrors) as Array<
      keyof EditPlaylistFormValues
    >;

    const labels = fieldNames.map((fieldName) => {
      return FORM_FIELD_LABELS[fieldName] ?? fieldName;
    });

    setSuccess(null);
    setformError(
      t("errors.formFieldsError", {
        count: labels.length,
        fields: labels.join(", "),
      }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted || isInitializing || !isAuthenticated) {
    return <CenteredLoader />;
  }

  if (usePlaylistLoading) {
    return <CenteredLoader />;
  }
  if (!slug) {
    return <Alert canClose>{t("playlists.notFound")}</Alert>;
  }
  if (usePlaylistError || !slug) {
    return (
      <div>
        <Alert canClose>{t("playlists.notFound")}</Alert>
        <Link href="/playlist/me">
          <Button color="brand" variant="secondary" type="reset">
            {t("playlists.backToMyPlaylists")}
          </Button>
        </Link>
      </div>
    );
  }
  if (playlist && !isOwner) {
    return (
      <div>
        <Alert>
          {t("playlists.noPermissionToEditPlaylist")}
        </Alert>
        <BackButton label={t("common.back")} />
      </div>
    );
  }

  return (
    <div>
      <BackButton label={t("common.back")} />
      <h1>
        {t("playlists.editPlaylist")} {playlist?.title}
      </h1>

      {/* ---------- Global alerts ---------- */}
      {formError && (
        <Alert type={VariantType.ERROR} canClose>
          {formError}
        </Alert>
      )}
      {success && (
        <Alert type={VariantType.SUCCESS} canClose>
          {success}
        </Alert>
      )}
      {error && (
        <Alert type={VariantType.ERROR} canClose>
          {error}
        </Alert>
      )}

      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <PlaylistForm
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
          isMobile={isMobile}
          isLoading={usePlaylistLoading}
          submitLabel={t("common.save")}
          secondaryActions={
            <>
              <Button
                fullWidth={isMobile}
                size="small"
                color="brand"
                variant="bordered"
                type="button"
                icon={<RemoveRedEyeIcon aria-hidden="true" />}
                iconPosition="right"
                onClick={() =>
                  openConfirmLeave(() => router.push(`/playlist/${slug}`))
                }
              >
                {t("playlists.seePlaylist")}
              </Button>

              <Button
                fullWidth={isMobile}
                size="small"
                color="error"
                variant="primary"
                type="button"
                onClick={() =>
                  openConfirmLeave(() =>
                    router.push(`/playlist/delete/${slug}`),
                  )
                }
              >
                {t("playlists.delete")}
              </Button>
            </>
          }
        />
      </form>

      <Dialog open={confirmLeaveOpen} onClose={handleCancelLeave}>
        <DialogTitle>Modifications non enregistrées</DialogTitle>
        <DialogContent>
          {t("common.unsavedChangesLeaveConfirmation")}
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            variant="secondary"
            color="neutral"
            onClick={handleCancelLeave}
          >
            {t("common.stayOnPage")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            color="brand"
            onClick={handleConfirmLeave}
          >
            {t("common.leaveWithoutSaving")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
