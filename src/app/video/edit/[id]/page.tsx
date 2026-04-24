"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import {
  Alert,
  Button,
  Checkbox,
  Input,
  InputPassword,
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
import { User, VideoStatus } from "@/src/types/interface";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import styles from "./page.module.css";
import { Divider } from "@mui/material";
import { useUsers } from "@/src/hooks/useUsers";

export const breadcrumbLabel = "Editer la video";

const formSteps = ["Détails", "Eléments video", "Visibilité"];

type EditVideoFormValues = {
  title: string;
  description: string;
  status: VideoStatus;
  language: string;
  thumbnail: File | null;
  license: string;
  co_owners: Array<User>;
  is_auth_required: boolean;
  password: string;
};

export default function EditVideo() {
  const params = useParams();
  const getVideoSlug = Array.isArray(params.id) ? params.id[0] : params.id;
  const { accessToken, refresh } = useAuth();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { config } = useAppConfig();
  const [activeStep, setActiveStep] = useState(0);
  const [formError, setformError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { fetchOne, video, useVideoLoading, useVideoError } = useVideos();
  const { fetchAll, users, useUserLoading, useUserError } = useUsers();

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
      status: "DR",
      language: "fr",
      thumbnail: null,
      license: "_NONE_",
      co_owners: [],
      is_auth_required: false,
      password: "",
    },
  });

  const selectedStatus = useWatch({ control, name: "status" });

  useEffect(() => {
    if (!getVideoSlug) return;
    fetchOne(getVideoSlug);
  }, [getVideoSlug, fetchOne]);

  useEffect(() => {
    if (!video) return;
    reset({
      title: video.title ?? "",
      description: video.description ?? "",
      status: video.status ?? "DR",
      language: video.language ?? "fr",
      thumbnail: null,
      license:
        video.license === "" || video.license == null
          ? "_NONE_"
          : video.license,
      co_owners: [],
      is_auth_required: video.is_auth_required ?? false,
      password: "",
    });
  }, [video, reset]);

  useEffect(() => {
    if (!mounted || isInitializing || !isAuthenticated) {
      return;
    }
    fetchAll();
    console.log(users);
  }, [fetchAll, mounted, isInitializing, isAuthenticated]);

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

  if (!getVideoSlug) {
    return <div>ID invalide</div>;
  }

  const handleNextStep = () => {
    setActiveStep((current) => Math.min(current + 1, formSteps.length - 1));
  };

  const handlePreviousStep = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const onSubmit = async (data: EditVideoFormValues) => {
    setformError(null);
    if (!accessToken) {
      setformError("Vous devez etre connecté pour modifier cette vidéo.");
      return;
    }

    try {
      const normalizedLicense = data.license === "_NONE_" ? "" : data.license;
      const formData = new FormData();
      formData.append("title", data.title ?? "");
      formData.append("description", data.description ?? "");
      formData.append("status", data.status ?? "DR");
      formData.append("language", data.language ?? "");
      formData.append("license", normalizedLicense);

      if (data.status === "RE") {
        formData.append(
          "is_auth_required",
          String(Boolean(data.is_auth_required)),
        );
        if (data.password.trim().length > 0) {
          formData.append("password", data.password.trim());
        }
      }

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

      if (res.ok) {
        setSuccess("Video mise a jour avec succès.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      await requestJson(res);
      await fetchOne(getVideoSlug);
    } catch (err: unknown) {
      setformError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    }
  };

  return (
    <div>
      <h1>Edition de la vidéo "{video?.title}"</h1>
      {useVideoError && (
        <Alert canClose type="error">
          {useVideoError}
        </Alert>
      )}
      {formError && (
        <Alert canClose type="error">
          {formError}
        </Alert>
      )}
      {success && (
        <Alert canClose type="success">
          {success}
        </Alert>
      )}
      <Alert>Statut de la vidéo : {video?.status_label}</Alert>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {formSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <div className={styles.stepper_title}>
          <h2>{formSteps[activeStep]}</h2>

          <div className={styles.stepper_actions}>
            <Button
              type="button"
              disabled={activeStep === 0}
              onClick={handlePreviousStep}
            >
              Précedent
            </Button>

            <Button
              type="button"
              disabled={activeStep == formSteps.length - 1}
              onClick={handleNextStep}
            >
              Suivant
            </Button>

            <Button
              type="submit"
              color="success"
              disabled={isSubmitting || useVideoLoading}
            >
              Enregistrer
            </Button>
          </div>
        </div>
        <Divider />

        {activeStep === 0 && (
          <>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Le titre est requis." }}
              render={({ field, fieldState }) => (
                <Input
                  required
                  fullWidth
                  label="Titre"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  state={fieldState.error ? "error" : "default"}
                  text={
                    fieldState.error?.message
                      ? fieldState.error.message
                      : "Un titre aussi court et precis que possible, refletant le sujet principal."
                  }
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <TextArea
                  fullWidth
                  label="Description"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  state={fieldState.error ? "error" : "default"}
                  text={
                    fieldState.error?.message
                      ? fieldState.error.message
                      : "Decrivez le contenu et/ou le contexte de votre video."
                  }
                />
              )}
            />
            <Controller
              name="language"
              control={control}
              render={() => (
                <Select
                  fullWidth
                  label="Langue principale"
                  state={errors.language ? "error" : "default"}
                  text={
                    errors.language?.message
                      ? errors.language?.message
                      : "Selectionnez la langue utilisee dans la video."
                  }
                  defaultValue="fr"
                  options={[
                    { label: "Francais", value: "fr" },
                    { label: "Anglais", value: "en" },
                  ]}
                  {...register("language")}
                />
              )}
            />
            <div className={styles.thumbnail_field}>
              <FileUploader
                bigText="Ajouter une vignette"
                state={errors.thumbnail ? "error" : "default"}
                onFilesChange={(event) => {
                  const file = event.target.value?.[0] ?? null;
                  setValue("thumbnail", file, {
                    shouldValidate: Boolean(file),
                  });
                  if (!file) {
                    clearErrors("thumbnail");
                  }
                }}
                accept=".jpg, .png,"
                text={
                  errors.thumbnail?.message ? (
                    errors.thumbnail.message
                  ) : (
                    <p>
                      Illustrez votre video en ajoutant une vignette. Les
                      formats suivants sont supportes : png, jpg
                    </p>
                  )
                }
              />
              <div>
                {video?.thumbnail ? (
                  <div className={styles.thumbnail_preview}>
                    <p>Vignette actuelle : </p>
                    <img
                      src={video.thumbnail}
                      alt="Vignette actuelle"
                      width={120}
                      height={120}
                    />
                    <Button variant="primary" size="nano" color="warning">
                      <span className={`material-icons `}>delete_outline</span>
                      Supprimer la vignette
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
            <Controller
              name="co_owners"
              control={control}
              render={({ field, fieldState }) => (
                <SelectMulti
                  label="Proprietaire.s additionnel.s"
                  fullWidth
                  searchable
                  state={fieldState.error ? "error" : "default"}
                  text={
                    fieldState.error?.message
                      ? fieldState.error.message
                      : "Sélectionnez un ou des propriétaires additionnels qui auront les memes droits que vous, sauf le droit de suppression de la video."
                  }
                  value={field.value ?? []}
                  onChange={(event) => field.onChange(event.target.value)}
                  onBlur={field.onBlur}
                  options={users.map((user) => ({
                    label: user.username || user.email,
                    value: user,
                  }))}
                />
              )}
            />
            <Controller
              name="license"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  fullWidth
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
          </>
        )}

        {activeStep === 1 && (
          <Alert type="info">Aucun champ a renseigner pour le moment.</Alert>
        )}

        {activeStep === 2 && (
          <>
            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  fullWidth
                  label="Statut de la video"
                  value={field.value ?? "DR"}
                  onChange={(event) => field.onChange(event.target.value)}
                  onBlur={field.onBlur}
                  state={fieldState.error ? "error" : "default"}
                  text={
                    fieldState.error?.message ??
                    "Choisissez le niveau de visibilite de la video."
                  }
                  options={[
                    { label: "Privee", value: "DR" },
                    { label: "Publique", value: "PU" },
                    { label: "Acces restreint", value: "RE" },
                  ]}
                />
              )}
            />

            {selectedStatus === "RE" && (
              <div className={styles.restreint_fields}>
                <p>Acces restreint :</p>
                <Controller
                  name="is_auth_required"
                  control={control}
                  render={() => (
                    <Checkbox
                      label="Authentification requise"
                      fullWidth
                      state={errors.is_auth_required ? "error" : "default"}
                      text={
                        errors.is_auth_required?.message ??
                        "Selectionnez pour limiter l'acces a votre video uniquement aux personnes authentifiees."
                      }
                      {...register("is_auth_required")}
                    />
                  )}
                />
                <InputPassword
                  label="Mot de passe de la video"
                  fullWidth
                  autoComplete="new-password"
                  state={errors.password ? "error" : "default"}
                  text={
                    errors.password?.message ??
                    "Vous pouvez proteger l'acces a votre video par un mot de passe. Laissez vide pour ne pas modifier un mot de passe deja existant."
                  }
                  {...register("password", {
                    validate: (value) =>
                      value.trim().length === 0 ||
                      value.trim().length >= 4 ||
                      "Le mot de passe doit contenir au moins 4 caracteres.",
                  })}
                />
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
