"use client";

import { useForm, useWatch, FieldErrors } from "react-hook-form";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/src/components/BackButton/BackButton";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { usePlaylist } from "@/src/hooks/usePlaylist";
import { usePlaylistPermissions } from "@/src/hooks/usePlaylistPermission";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import type { PlaylistRequest } from "@/src/types";
import Link from "next/link";
import styles from "./styles.module.css";
import TextField from "@mui/material/TextField";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { PlaylistForm } from "@/src/components/collection/PlaylistForm";
import type { CollectionOrder } from "@/src/constants/collection";

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
    watch,
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

  const initialValuesRef = useRef<EditPlaylistFormValues | null>(null);
  const isPublic = watch("is_public");
  const watchedValues = useWatch({ control });

  // Si la playlist redevient publique, on désactive et on nettoie la partie mot de passe
  useEffect(() => {
    if (isPublic) {
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
    if (!playlist) return;

    const initialValues: EditPlaylistFormValues = {
      title: playlist.title ?? "",
      description: playlist.description ?? "",
      is_public: playlist.is_public ?? true,
      password: "",
      default_order: playlist.default_order ?? "created_at",
      is_password_required: playlist.is_protected ?? false,
    };

    initialValuesRef.current = initialValues;
    reset(initialValues);
  }, [playlist, reset]);

  const hasUnsavedChanges = useMemo(() => {
    if (!initialValuesRef.current) return false;
    return (
      JSON.stringify(initialValuesRef.current) !== JSON.stringify(watchedValues)
    );
  }, [watchedValues]);

  /* Alert si le user quitte la page sans enregistrer */
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
      setError("Erreur lors de l'enregistrement du formulaire");
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
      setError("Le titre est obligatoire.");
      return;
    }

    // Playlist privée : jamais de mot de passe
    if (!data.is_public) {
      payload.password = "";
    } else {
      // Playlist publique : mot de passe optionnel,
      // mais obligatoire si la case \"protéger par un mot de passe\" est cochée
      if (data.is_password_required && !passwordValue) {
        setError(
          "Vous avez activé la protection par mot de passe, veuillez saisir un mot de passe.",
        );
        return;
      }

      if (data.is_password_required && passwordValue) {
        payload.password = passwordValue;
      }
    }

    const updated = await updatePlaylist(slug, payload);
    if (updated) {
      setSuccess("Liste de lecture mise à jour avec succès ! 🥳");
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
      labels.length > 1
        ? `Veuillez corriger les ${labels.length} champs suivants : ${labels.join(", ")}.`
        : `Veuillez corriger le champ suivant : ${labels[0]}.`,
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
    return <Alert canClose>Liste de lecture introuvable.</Alert>;
  }
  if (usePlaylistError || !slug) {
    return (
      <div>
        <Alert canClose>Liste de lecture introuvable.</Alert>
        <Link href="/playlist/me">
          <Button color="brand" variant="secondary" type="reset">
            Retour à mes listes de lectures
          </Button>
        </Link>
      </div>
    );
  }
  if (playlist && !isOwner) {
    return (
      <div>
        <Alert>
          Vous n’avez pas les droits pour modifier cette liste de lecture.
        </Alert>
        <BackButton label="Retour" />
      </div>
    );
  }

  return (
    <div>
      <BackButton label="Retour" />
      <h1>Éditer la liste de lecture {playlist?.title}</h1>

      {/* ---------- Alertes globales ---------- */}
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
          submitLabel="Enregistrer"
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
                Voir la playlist
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
                Supprimer la playlist
              </Button>
            </>
          }
        />
      </form>

      <Dialog open={confirmLeaveOpen} onClose={handleCancelLeave}>
        <DialogTitle>Modifications non enregistrées</DialogTitle>
        <DialogContent>
          Vous avez des modifications non enregistrées. Voulez-vous vraiment
          quitter cette page ?
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            variant="secondary"
            color="neutral"
            onClick={handleCancelLeave}
          >
            Rester sur la page
          </Button>
          <Button
            type="button"
            variant="secondary"
            color="brand"
            onClick={handleConfirmLeave}
          >
            Quitter sans enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
