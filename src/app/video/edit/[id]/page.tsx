"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Input,
  TextArea,
  Loader,
  Select,
  FileUploader,
  SelectMulti,
} from "@openfun/cunningham-react";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useVideos } from "@/src/hooks/useVideos";
import { User } from "@/src/types/interface";
import { useAppConfig } from "@/src/hooks/useAppConfig";

export const breadcrumbLabel = "Editer la video";

type EditVideoFormValues = {
  title: string;
  description: string;
  language: string;
  thumbnail: File | null;
  license: string;
  co_owners: Array<User>;
};

export default function EditVideo() {
  const params = useParams();
  const getVideoSlug = Array.isArray(params.id) ? params.id[0] : params.id;
  const { accessToken, refresh } = useAuth();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { config } = useAppConfig();
  const [formError, setformError] = useState<string | null>(null);

  const { fetchOne, video, error, loading } = useVideos();

  const defaultLicenseOptions = [
    "CC-BY",
    "CC-BY-SA",
    "CC-BY-NC",
    "CC-BY-ND",
    "COPYRIGHT",
  ];
  const licenseOptionsSource =
    config?.VIDEO_LICENSE_CHOICES && config.VIDEO_LICENSE_CHOICES.length > 0
      ? config.VIDEO_LICENSE_CHOICES
      : defaultLicenseOptions;
  const licenseOptions = [
    { label: "Aucune", value: "_NONE_" },
    ...licenseOptionsSource.map((licenseCode) => ({
      label: licenseCode,
      value: licenseCode,
    })),
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    clearErrors,
  } = useForm<EditVideoFormValues>({
    defaultValues: {
      title: "",
      description: "",
      language: "fr",
      thumbnail: null,
      license: "_NONE_",
      co_owners: [],
    },
  });

  useEffect(() => {
    if (!getVideoSlug) return;
    fetchOne(getVideoSlug);
  }, [getVideoSlug, fetchOne]);

  useEffect(() => {
    if (!video) return;
    reset({
      title: video.title ?? "",
      description: video.description ?? "",
      language: video.language ?? "fr",
      thumbnail: null,
      license:
        video.license === "" || video.license == null
          ? "_NONE_"
          : video.license,
      co_owners: [],
    });
  }, [video, reset]);

  if (!mounted || isInitializing || !isAuthenticated)
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

  if (!getVideoSlug) {
    return <div>ID invalide</div>;
  }

  const onSubmit = async (data: EditVideoFormValues) => {
    setformError(null);
    if (!accessToken) {
      setformError("Vous devez etre connecte pour modifier cette video.");
      return;
    }

    try {
      const normalizedLicense = data.license === "_NONE_" ? "" : data.license;
      const formData = new FormData();
      formData.append("title", data.title ?? "");
      formData.append("description", data.description ?? "");
      formData.append("language", data.language ?? "");
      formData.append("license", normalizedLicense);

      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
      data.co_owners?.forEach((owner) => {
        formData.append("co_owners", String(owner.id));
      });

      const res = await authFetch(getRoutes().video.update(getVideoSlug), {
        method: "PATCH",
        body: formData,
        accessToken,
        onRefresh: refresh,
      });

      await requestJson(res);
      await fetchOne(getVideoSlug);
    } catch (err: any) {
      setformError(err?.message ?? "Une erreur est survenue.");
    }
  };

  const thumbnailRegister = register("thumbnail");

  return (
    <div>
      <h1>Edition de la video {video?.title} </h1>
      <Alert>{video?.status_label}</Alert>
      <h2>Details de la video</h2>
      {error && (
        <Alert canClose type="error">
          {error}
        </Alert>
      )}
      {formError && (
        <Alert canClose type="error">
          {formError}
        </Alert>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: "Le titre est requis." }}
          render={({ field, fieldState }) => (
            <Input
              fullWidth={true}
              label="Titre"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              state={fieldState.error ? "error" : "default"}
              text={
                fieldState.error?.message
                  ? fieldState.error.message
                  : "Un titre aussi court et précis que possible, reflétant le sujet principal."
              }
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <TextArea
              fullWidth={true}
              label="Description"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              state={fieldState.error ? "error" : "default"}
              text={
                fieldState.error?.message
                  ? fieldState.error.message
                  : "Décrivez le contenu et/ou le contexte de votre vidéo."
              }
            />
          )}
        />
        <Select
          fullWidth={true}
          label="Langue principale"
          state={errors.language ? "error" : "default"}
          text={
            errors.language?.message
              ? errors.language?.message
              : "Sélectionnez la langue utilisée dans la video."
          }
          defaultValue="fr"
          options={[
            { label: "FR", value: "fr" },
            { label: "EN", value: "en" },
          ]}
          {...register("language")}
        />
        <Controller
          name="license"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              fullWidth={true}
              label="Licence"
              value={field.value ?? "_NONE_"}
              onChange={(event) => field.onChange(event.target.value)}
              onBlur={field.onBlur}
              state={fieldState.error ? "error" : "default"}
              text={
                fieldState.error?.message ??
                "Choisissez la licence de publication."
              }
              options={licenseOptions}
            />
          )}
        />

        <FileUploader
          bigText="Ajouter une vignette"
          fullWidth={true}
          state={errors.thumbnail ? "error" : "default"}
          name={thumbnailRegister.name}
          onBlur={thumbnailRegister.onBlur}
          ref={thumbnailRegister.ref}
          onFilesChange={(event) => {
            const file = event.target.value?.[0] ?? null;
            setValue("thumbnail", file, { shouldValidate: Boolean(file) });
            if (!file) {
              clearErrors("thumbnail");
            }
          }}
          accept=".jpg, .png,"
          text={
            errors.thumbnail?.message ? (
              errors.thumbnail.message
            ) : (
              <>
                <p>
                  Illustrez votre vidéo en ajoutant une vignette. Les formats
                  suivants sont supportes : png, jpg
                </p>
              </>
            )
          }
        />
        <SelectMulti
          label="Proprietaire.s additionnel.s"
          fullWidth={true}
          searchable
          state={errors.co_owners ? "error" : "default"}
          text={
            errors.co_owners?.message
              ? errors.co_owners?.message
              : "Sélectionnez un ou des propriétaires additionnels qui auront les mêmes droits que vous, sauf le droit de suppression de la vidéo."
          }
          defaultValue="fr"
          options={[
            { label: "pedrop", value: "PEDRO Pascal" },
            { label: "dupontm", value: "  DUPONT Marin" },
          ]}
          {...register("co_owners")}
        />

        <Button type="submit" disabled={isSubmitting || loading}>
          Enregistrer
        </Button>
      </form>
    </div>
  );
}



