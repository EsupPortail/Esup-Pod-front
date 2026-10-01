"use client";

import { useForm, useWatch, FieldErrors } from "react-hook-form";
import { Alert, VariantType } from "@openfun/cunningham-react";
import { useEffect, useRef, useState } from "react";
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
import { useTranslation } from "@/src/hooks/useTranslation";

export const breadcrumbLabel = "Ajouter une liste de lecture";

type AddPlaylistFormValues = {
  title: string;
  description: string;
  is_public: boolean;
  is_password_required: boolean;
  password: string;
  default_order: CollectionOrder;
};

export default function AddPlaylist() {
  const { t } = useTranslation();

  const FORM_FIELD_LABELS: Partial<
    Record<keyof AddPlaylistFormValues, string>
  > = {
    title: t("common.title"),
    description: t("common.description"),
    is_password_required: t("common.isPasswordRequired"),
    is_public: t("common.isPublic"),
    password: t("common.password"),
    default_order: t("common.defaultOrder"),
  };

  const router = useRouter();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { createPlaylist, usePlaylistLoading, usePlaylistError } =
    usePlaylist();
  const { setLastCreatedPlaylist } = usePlaylistCreationContext();

  const [error, setError] = useState<string | null>(null);
  const [formError, setformError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
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
  const isPasswordRequired = useWatch({
    control,
    name: "is_password_required",
  });

  // Initialise la ref APRÈS le premier rendu (interdit pendant le render)
  useEffect(() => {
    if (!initialValuesRef.current) {
      initialValuesRef.current = watchedValues as AddPlaylistFormValues;
    } else {
      const changed =
        JSON.stringify(initialValuesRef.current) !==
        JSON.stringify(watchedValues);
      setIsDirty(changed);
    }
  }, [watchedValues]);

  // isDirty est disponible pour une future confirmation de navigation non sauvegardée
  void isDirty;

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
      setError(t("common.titleRequired"));
      return;
    }

    if (!payload.description) {
      setError(`${t("common.descRequired")}`);
      return;
    }

    if (!data.is_public) {
      payload.password = "";
    } else {
      if (isPasswordRequired && !passwordValue) {
        setError(`${t("common.passwordProtected")}`);
        return;
      }

      if (isPasswordRequired && passwordValue) {
        payload.password = passwordValue;
      }
    }

    try {
      const created = await createPlaylist(payload);

      if (!created) {
        setError(usePlaylistError ?? `${t("playlists.creationError")}`);
        return;
      }

      // Store the created playlist in the global context
      setLastCreatedPlaylist(created);

      reset();

      router.push(`/playlist/${created.slug}`);
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : `${t("playlists.creationError")}`;
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

  return (
    <div>
      <BackButton label={t("common.back")} />
      <h1>{t("playlist.addPlaylist")}</h1>

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
          submitLabel={t("playlist.addThePlaylist")}
        />
      </form>
    </div>
  );
}
