"use client";

import { useForm, useWatch, FieldErrors } from "react-hook-form";
import { Alert, VariantType } from "@openfun/cunningham-react";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/src/components/BackButton/BackButton";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { usePlaylist } from "@/src/hooks/usePlaylist";
import type { PlaylistRequest } from "@/src/types";
import type { CollectionOrder } from "@/src/constants/collection";
import useMediaQuery from "@mui/material/useMediaQuery";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import styles from "../edit/[slug]/styles.module.css";
import { PlaylistForm } from "@/src/components/collection/PlaylistForm";
import { usePlaylistCreationContext } from "@/src/context/PlaylistCreationContext";

export const breadcrumbLabel = "Ajouter une liste de lecture";

type AddPlaylistFormValues = {
  title: string;
  description: string;
  is_public: boolean;
  is_password_required: boolean;
  password: string;
  default_order: CollectionOrder;
};

const FORM_FIELD_LABELS: Partial<Record<keyof AddPlaylistFormValues, string>> =
  {
    title: "Titre",
    description: "Description",
    is_password_required: "Ajouter un mot de passe",
    is_public: "Statut",
    password: "Mot de passe",
    default_order: "Tri par défault",
  };

export default function AddPlaylist() {
  const router = useRouter();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { createPlaylist, usePlaylistLoading, usePlaylistError } =
    usePlaylist();
  const { setLastCreatedPlaylist } = usePlaylistCreationContext();

  const [error, setError] = useState<string | null>(null);
  const [formError, setformError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 932px)");

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<AddPlaylistFormValues>({
    defaultValues: {
      title: "",
      description: "",
      is_public: true,
      is_password_required: false,
      password: "",
      default_order: "created_at",
    },
  });

  const initialValuesRef = useRef<AddPlaylistFormValues | null>(null);
  const watchedValues = useWatch({ control });
  const isPublic = useWatch({ control, name: "is_public" });
  const isPasswordRequired = useWatch({
    control,
    name: "is_password_required",
  });

  const hasUnsavedChanges = useMemo(() => {
    if (!initialValuesRef.current) {
      // première initialisation
      initialValuesRef.current = watchedValues as AddPlaylistFormValues;
      return false;
    }
    return (
      JSON.stringify(initialValuesRef.current) !== JSON.stringify(watchedValues)
    );
  }, [watchedValues]);

  const onSubmit = async (data: AddPlaylistFormValues) => {
    setError(null);
    setformError(null);

    const passwordValue = data.password.trim();

    const payload: PlaylistRequest = {
      title: data.title.trim(),
      description: data.description.trim(),
      is_public: data.is_public,
      password: "",
      default_order: data.default_order,
    };

    if (!payload.title) {
      setError("Le titre est obligatoire.");
      return;
    }

    if (!payload.description) {
      setError("La description est obligatoire.");
      return;
    }

    if (!data.is_public) {
      payload.password = "";
    } else {
      if (isPasswordRequired && !passwordValue) {
        setError(
          "Vous avez activé la protection par mot de passe, veuillez saisir un mot de passe.",
        );
        return;
      }

      if (isPasswordRequired && passwordValue) {
        payload.password = passwordValue;
      }
    }

    try {
      const created = await createPlaylist(payload);

      if (!created) {
        setError(
          usePlaylistError ??
            "Une erreur est survenue lors de la création de la playlist.",
        );
        return;
      }

      // On stocke la playlist créée dans le contexte global
      setLastCreatedPlaylist(created);

      reset();

      router.push(`/playlist/${created.slug}`);
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : "Une erreur inattendue est survenue lors de la création de la playlist.";
      setError(message);
    }
  };

  const onInvalid = (formErrors: FieldErrors<AddPlaylistFormValues>) => {
    const fieldNames = Object.keys(formErrors) as Array<
      keyof AddPlaylistFormValues
    >;

    const labels = fieldNames.map((fieldName) => {
      return FORM_FIELD_LABELS[fieldName] ?? fieldName;
    });

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

  return (
    <div>
      <BackButton label="Retour" />
      <h1>Ajouter une liste de lecture</h1>

      {(formError || error || usePlaylistError) && (
        <Alert type={VariantType.ERROR} canClose>
          {formError ?? error ?? usePlaylistError}
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
          submitLabel="Ajouter la playlist"
        />
      </form>
    </div>
  );
}
