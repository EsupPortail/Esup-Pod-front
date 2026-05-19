"use client";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Alert, Button, FileUploader, Loader } from "@openfun/cunningham-react";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useVideos } from "@/src/hooks/useVideos";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import { useUsers } from "@/src/hooks/useUsers";
import { getUserDisplayName } from "@/src/constants/user";
import { useIsStaff } from "@/src/hooks/useIsStaff";
import { useDiscipline } from "@/src/hooks/useDiscipline";
import { useSubtitle } from "@/src/hooks/useSubtitle";
import { useTypes } from "@/src/hooks/useTypes";
import { User } from "@/src/types/interface";
import Link from "next/link";
import styles from "./page.module.css";
import { Chip } from "@mui/material";
import { CURSUS_OPTIONS } from "@/src/constants/cursus";
import {
  LanguageSubtitle,
  SUBTITLE_LANGUAGE_OPTIONS,
  VIDEO_LANGUAGE_OPTIONS,
} from "@/src/constants/language";
import {
  DEFAULT_VIDEO_LICENSE_OPTIONS,
  VideoStatus,
  VIDEO_STATUS_OPTIONS,
} from "@/src/constants/video";

export const breadcrumbLabel = "Éditer la vidéo";

const formSteps = ["Détails", "Éléments vidéo", "Visibilité"];

type EditVideoFormValues = {
  title: string;
  description: string;
  status: VideoStatus;
  language: string;
  thumbnail: File | null;
  license: string;
  owner: string;
  co_owners: number[];
  is_auth_required: boolean;
  is_password_required: boolean;
  password: string;
  disciplines: number[];
  type_id: number | "";
  tags: string;
  allow_downloading: boolean;
  disable_comment: boolean;
  is_360: boolean;
  cursus: string;
};

export default function EditVideo() {
  const id = React.useId();
  const params = useParams();
  const getVideoSlug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;
  const { accessToken, refresh } = useAuth();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { config } = useAppConfig();
  const { isStaff } = useIsStaff();
  const { fetchOne, video, useVideoLoading, useVideoError } = useVideos();
  const { fetchAll: fetchUsers, users } = useUsers();
  const { fetchAll: fetchDisciplines, discipline: disciplines } =
    useDiscipline();
  const { addSubtitle, deleteSubtitle, useSubtitleLoading, useSubtitleError } =
    useSubtitle();
  const { fetchAll: fetchTypes, types } = useTypes();

  const [activeStep, setActiveStep] = useState(0);
  const [formError, setformError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [subtitleLanguage, setSubtitleLanguage] =
    useState<LanguageSubtitle>("fr");
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const [subtitleIsDefault, setSubtitleIsDefault] = useState(false);

  const licenseOptionsSource =
    config?.VIDEO_LICENSE_CHOICES && config.VIDEO_LICENSE_CHOICES.length > 0
      ? config.VIDEO_LICENSE_CHOICES
      : DEFAULT_VIDEO_LICENSE_OPTIONS;

  const licenseOptions = [
    { label: "Aucune", value: "_NONE_" },
    ...licenseOptionsSource.map((licenseCode) => ({
      label: licenseCode,
      value: licenseCode,
    })),
  ];

  const {
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
      status: "PU",
      language: "fr-fr",
      thumbnail: null,
      license: "_NONE_",
      owner: "",
      co_owners: [],
      is_auth_required: false,
      is_password_required: false,
      password: "",
      disciplines: [],
      type_id: "",
      tags: "",
      allow_downloading: false,
      disable_comment: false,
      is_360: false,
      cursus: "0",
    },
  });

  const selectedStatus = useWatch({ control, name: "status" });
  const isPasswordRequired = useWatch({
    control,
    name: "is_password_required",
  });
  const watchOwner = useWatch({ control, name: "owner" });

  useEffect(() => {
    if (!getVideoSlug) return;
    fetchOne(getVideoSlug);
  }, [getVideoSlug, fetchOne]);

  useEffect(() => {
    if (!mounted || isInitializing || !isAuthenticated) return;
    fetchUsers();
    fetchDisciplines();
    fetchTypes();
  }, [
    mounted,
    isInitializing,
    isAuthenticated,
    fetchUsers,
    fetchDisciplines,
    fetchTypes,
  ]);

  const initialDisciplineIds = useMemo(() => {
    if (video?.discipline && video.discipline.length > 0) {
      return video.discipline;
    }

    return video?.discipline_details?.map((item) => item.id) ?? [];
  }, [video?.discipline, video?.discipline_details]);

  const initialTypeId = useMemo(() => {
    if (typeof video?.type_id === "number") {
      return video.type_id;
    }

    if (!video?.type_name) {
      return "";
    }

    const matchedType = types.find(
      (type) => type.title === video.type_name || type.slug === video.type_name,
    );

    return matchedType?.id ?? "";
  }, [types, video]);

  useEffect(() => {
    if (!video) return;

    reset({
      title: video.title ?? "",
      description: video.description ?? "",
      status: video.status ?? "PU",
      language: video.language ?? "fr-fr",
      thumbnail: null,
      license:
        video.license === "" || video.license == null
          ? "_NONE_"
          : video.license,
      owner: video.owner ?? "",
      is_auth_required: video.is_auth_required ?? false,
      is_password_required: video.has_password ?? false,
      password: "",
      co_owners: video.co_owners ?? [],
      disciplines: initialDisciplineIds,
      type_id: initialTypeId,
      tags: Array.isArray(video.tags) ? video.tags.join(",") : "",
      allow_downloading: video.allow_downloading ?? false,
      is_360: video.is_360 ?? false,
      cursus: video.cursus ?? "0",
    });
  }, [video, reset, initialDisciplineIds, initialTypeId]);

  const selectedOwner = useMemo(() => {
    return (
      users.find((user) => {
        const fullName = getUserDisplayName(user);
        return user.username === video?.owner || fullName === video?.owner;
      }) ?? null
    );
  }, [users, video?.owner]);

  const availableCoOwners = useMemo(() => {
    return users.filter((user) => user.username !== watchOwner);
  }, [users, watchOwner]);

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

  if (useVideoError || !getVideoSlug) {
    return (
      <div>
        <Alert canClose type="error">
          {useVideoError ?? "Vidéo introuvable."}
        </Alert>
        <Link key="error-dashboard-link" href="/dashboard">
          <Button color="brand" variant="secondary" type="reset">
            Retour au tableau de bord
          </Button>
        </Link>
      </div>
    );
  }

  const handleNextStep = () => {
    setActiveStep((current) => Math.min(current + 1, formSteps.length - 1));
  };

  const handlePreviousStep = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  const removeThumbnail = () => {
    setValue("thumbnail", null);
    const element = document.getElementById("thumbnail-preview");
    element?.remove();
  };

  const getUserLabel = (user: User) => {
    const fullName = getUserDisplayName(user);
    return fullName || user.username;
  };
  const usedSubtitleLanguages = new Set(
    (video?.subtitles ?? []).map((subtitle) => subtitle.language.toLowerCase()),
  );

  const handleAddSubtitle = async () => {
    setformError(null);
    setSuccess(null);

    if (!video?.id) {
      setformError("Impossible d'ajouter un sous-titre à cette vidéo.");
      return;
    }

    if (!subtitleFile) {
      setformError("Veuillez sélectionner un fichier de sous-titre.");
      return;
    }

    const createdSubtitle = await addSubtitle({
      video: video.id,
      language: subtitleLanguage,
      file: subtitleFile,
      is_default: subtitleIsDefault,
    });

    if (!createdSubtitle) {
      return;
    }

    setSubtitleFile(null);
    setSubtitleLanguage("fr");
    setSubtitleIsDefault(false);
    await fetchOne(getVideoSlug);
  };

  const handleDeleteSubtitle = async (subtitleId: number) => {
    setformError(null);
    setSuccess(null);

    const deleted = await deleteSubtitle(subtitleId);

    if (!deleted) {
      return;
    }
    await fetchOne(getVideoSlug);
  };

  const onSubmit = async (data: EditVideoFormValues) => {
    setformError(null);
    setSuccess(null);

    if (!accessToken) {
      setformError("Vous devez être connecté pour modifier cette vidéo.");
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
      formData.append("allow_downloading", data.allow_downloading ?? false);
      formData.append("is_360", data.is_360 ?? false);
      formData.append("disable_comment", data.disable_comment ?? false);
      formData.append("cursus", data.cursus ?? "0");

      data.co_owners.forEach((id) => {
        formData.append("co_owners", String(id));
      });

      if (data.status === "RE") {
        formData.append(
          "is_auth_required",
          String(Boolean(data.is_auth_required)),
        );
        console.log(video?.has_password);

        console.log(data.password);
        if (data.is_password_required && data.password.trim().length > 0) {
          formData.append("password", data.password.trim());
        } else if (video?.has_password) {
          formData.append("password", "");
        }
      }

      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      formData.append("owner", data.owner);
      data.disciplines.forEach((id) => {
        formData.append("disciplines", String(id));
      });
      if (data.type_id !== "") {
        formData.append("type_id", String(data.type_id));
      }
      /*data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .forEach((tag) => {
          formData.append("tags", tag);
        });*/

      const res = await authFetch(getRoutes().video.update(getVideoSlug), {
        method: "PATCH",
        body: formData,
        accessToken,
        onRefresh: refresh,
      });

      if (res.ok) {
        setSuccess("Vidéo mise à jour avec succès ! 🥳");
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
      <h1>
        Éditer la vidéo &quot;
        {video?.title}
        &quot;
      </h1>
      {formError && (
        <Alert canClose type="error">
          {formError}
        </Alert>
      )}
      {useSubtitleError && (
        <Alert canClose type="error">
          {useSubtitleError}
        </Alert>
      )}
      {success && (
        <Alert canClose type="success">
          {success}
        </Alert>
      )}{" "}
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div className={styles.form_actions}>
          <Alert>Statut de la vidéo : {video?.status_label}</Alert>
          <div className={styles.form_actions_buttons}>
            <Link key="video-link" href={`/video/${getVideoSlug}`}>
              <Button
                fullWidth
                color="brand"
                variant="bordered"
                type="reset"
                icon={<span className="material-icons">remove_red_eye</span>}
                iconPosition="right"
              >
                Voir la vidéo
              </Button>
            </Link>
            <Link key="dashboard-link" href="/dashboard">
              <Button fullWidth color="brand" variant="secondary" type="reset">
                Retour au tableau de bord
              </Button>
            </Link>
            <Link key="delete-link" href={`/video/delete/${getVideoSlug}`}>
              <Button fullWidth color="error" variant="primary" type="button">
                Supprimer la vidéo
              </Button>
            </Link>
            <Button
              fullWidth
              type="submit"
              color="success"
              variant="primary"
              disabled={isSubmitting || useVideoLoading}
            >
              Enregistrer
            </Button>
          </div>
        </div>

        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {formSteps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleStepClick(index)}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <div className={styles.stepper_title}>
          <h2>{formSteps[activeStep]}</h2>

          <div className={styles.stepper_actions}>
            <Button
              type="button"
              size="small"
              disabled={activeStep === 0}
              onClick={handlePreviousStep}
            >
              Précédent
            </Button>

            <Button
              type="button"
              size="small"
              disabled={activeStep === formSteps.length - 1}
              onClick={handleNextStep}
            >
              Suivant
            </Button>
          </div>
        </div>

        <Divider />

        {activeStep === 0 && (
          <>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Le titre est obligatoire." }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Titre"
                  error={Boolean(errors.title)}
                  helperText={
                    errors.title?.message ??
                    "Donnez un titre court et explicite à votre vidéo."
                  }
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="description"
                  multiline
                  rows={3}
                  label="Description"
                  helperText="Décrivez le contenu et/ou le contexte de votre vidéo."
                />
              )}
            />

            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  id="language"
                  fullWidth
                  label="Langue principale"
                  helperText="Sélectionnez la langue utilisée dans la vidéo."
                >
                  {VIDEO_LANGUAGE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Divider />

            <div className={styles.thumbnail_field}>
              <FileUploader
                id="thumbnail"
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
                accept=".jpg,.png"
                text={
                  errors.thumbnail?.message ? (
                    errors.thumbnail.message
                  ) : (
                    <p>
                      Illustrez votre vidéo en ajoutant une vignette. Les
                      formats suivants sont supportés : png, jpg
                    </p>
                  )
                }
              />

              <div id="thumbnail-preview">
                {video?.thumbnail ? (
                  <div className={styles.thumbnail_preview}>
                    <p>Vignette actuelle :</p>
                    <img
                      src={video.thumbnail}
                      alt="Vignette actuelle"
                      width={120}
                      height={120}
                    />
                    <Button
                      type="button"
                      onClick={removeThumbnail}
                      variant="primary"
                      size="nano"
                      color="warning"
                    >
                      <span className="material-icons">delete_outline</span>
                      Supprimer la vignette
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            <Divider />
            {isStaff && (
              <Controller
                name="owner"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={users}
                    value={
                      users.find((user) => user.username === field.value) ??
                      selectedOwner
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.username ?? "");
                    }}
                    getOptionLabel={getUserLabel}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Propriétaire"
                        helperText="Un super utilisateur peut changer le propriétaire d'une vidéo."
                      />
                    )}
                  />
                )}
              />
            )}
            <Controller
              name="co_owners"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={availableCoOwners}
                  value={availableCoOwners.filter((user) =>
                    field.value?.includes(user.id),
                  )}
                  onChange={(_, newValue) => {
                    field.onChange(newValue.map((user) => user.id));
                  }}
                  getOptionLabel={getUserLabel}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Co-propriétaires"
                      helperText="Sélectionnez un ou plusieurs co-propriétaires."
                    />
                  )}
                />
              )}
            />

            <Controller
              name="license"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  id="license"
                  fullWidth
                  label="Licence"
                  helperText="Choisissez la licence de publication."
                >
                  {licenseOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </>
        )}

        {activeStep === 1 && (
          <>
            <Divider />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${id}-panel1-content`}
                  id={`${id}-panel1-header`}
                >
                  <h3>Gérer les sous-titres</h3>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  {video?.subtitles && video.subtitles.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      <p>Sous-titres déjà ajoutés :</p>
                      {video.subtitles.map((subtitle) => (
                        <div
                          key={subtitle.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>
                            Version {subtitle.language.toUpperCase()}
                            {subtitle.is_default ? " • Par défaut" : ""}
                          </span>
                          <Button
                            type="button"
                            size="small"
                            color="warning"
                            variant="secondary"
                            disabled={useSubtitleLoading}
                            onClick={() => handleDeleteSubtitle(subtitle.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Chip
                      label="Aucun sous-titre ajouté pour le moment."
                      sx={{
                        backgroundColor: "var( --background-brand-secondary)",
                        color: "var(--background-brand)",
                        marginLeft: "14px",
                        fontSize: "var(--c--globals--font--sizes--sm)",
                        fontWeight: "var(--c--globals--font--weights--bold)",
                        marginBottom: "var(--c--globals--spacings--xs)",
                      }}
                    />
                  )}
                  <p>Ajouter un sous-titre :</p>
                  <TextField
                    select
                    fullWidth
                    label="Langue du sous-titre"
                    value={subtitleLanguage}
                    onChange={(event) =>
                      setSubtitleLanguage(
                        event.target.value as LanguageSubtitle,
                      )
                    }
                  >
                    {SUBTITLE_LANGUAGE_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        disabled={usedSubtitleLanguages.has(
                          option.value.toLowerCase(),
                        )}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <FileUploader
                    id="subtitle-file"
                    bigText="Ajouter un sous-titre"
                    state={subtitleFile ? "success" : "default"}
                    onFilesChange={(event) => {
                      const file = event.target.value?.[0] ?? null;
                      setSubtitleFile(file);
                    }}
                    accept=".vtt,.srt"
                    text={
                      subtitleFile ? (
                        <p>Fichier sélectionné : {subtitleFile.name}</p>
                      ) : (
                        <p>Formats supportés : `.vtt`, `.srt`.</p>
                      )
                    }
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={subtitleIsDefault}
                        onChange={(_, checked) => setSubtitleIsDefault(checked)}
                      />
                    }
                    label="Définir comme sous-titre par défaut"
                  />

                  <div>
                    <Button
                      type="button"
                      disabled={useSubtitleLoading || !subtitleFile}
                      onClick={handleAddSubtitle}
                    >
                      Ajouter le sous-titre
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>

            <Divider />
            <Controller
              name="disciplines"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={disciplines}
                  value={disciplines.filter((discipline) =>
                    field.value?.includes(discipline.id),
                  )}
                  onChange={(_, newValue) =>
                    field.onChange(newValue.map((discipline) => discipline.id))
                  }
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Disciplines"
                      helperText="Sélectionnez une ou plusieurs disciplines pour cette vidéo."
                      fullWidth
                    />
                  )}
                />
              )}
            />
            <Controller
              name="cursus"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Cursus"
                  helperText="Sélectionnez le cursus associé à la vidéo."
                >
                  {CURSUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="type_id"
              control={control}
              rules={{ required: "Le type de la vidéo est obligatoire." }}
              render={({ field }) => (
                <TextField
                  required
                  select
                  fullWidth
                  label="Type"
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                  onBlur={field.onBlur}
                  error={Boolean(errors.type_id)}
                  helperText={
                    errors.type_id?.message ??
                    "Sélectionnez le type de la vidéo."
                  }
                >
                  <MenuItem value="" disabled>
                    Sélectionnez un type
                  </MenuItem>
                  {types.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Tags"
                  fullWidth
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  onBlur={field.onBlur}
                  helperText='Saisissez les tags au format "tag,tag".'
                />
              )}
            />
            <div />
          </>
        )}

        {activeStep === 2 && (
          <>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Statut de la vidéo"
                  value={field.value ?? "PU"}
                  onChange={(event) =>
                    field.onChange(event.target.value as VideoStatus)
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  inputRef={field.ref}
                  helperText="Choisissez le niveau de visibilité de la vidéo."
                >
                  {VIDEO_STATUS_OPTIONS.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {selectedStatus === "RE" && (
              <div className={styles.restreint_fields}>
                <p>Accès restreint :</p>
                <div>
                  <Controller
                    name="is_auth_required"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={Boolean(fieldState.error)}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(field.value)}
                              onChange={(_, checked) => field.onChange(checked)}
                            />
                          }
                          label="Authentification requise"
                        />
                        <FormHelperText>
                          {fieldState.error?.message ??
                            "Sélectionnez pour limiter l'accès à votre vidéo uniquement aux personnes authentifiées."}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="is_password_required"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={Boolean(fieldState.error)}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(field.value)}
                              onChange={(_, checked) => field.onChange(checked)}
                            />
                          }
                          label="Mot de passe requis"
                        />
                        <FormHelperText>
                          {fieldState.error?.message ??
                            "Sélectionnez pour protéger la vidéo par mot de passe."}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />

                  {isPasswordRequired && (
                    <Controller
                      name="password"
                      control={control}
                      rules={{
                        validate: (value) =>
                          value.trim().length === 0 ||
                          value.trim().length >= 4 ||
                          "Le mot de passe doit contenir au moins 4 caractères.",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="password"
                          autoComplete="new-password"
                          label="Mot de passe de la vidéo"
                          error={Boolean(errors.password)}
                          helperText={
                            errors.password?.message ??
                            "Laissez vide pour ne pas modifier le mot de passe existant."
                          }
                        />
                      )}
                    />
                  )}
                </div>
              </div>
            )}
            <Controller
              name="allow_downloading"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl error={Boolean(fieldState.error)}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(_, checked) => field.onChange(checked)}
                      />
                    }
                    label="Autoriser le téléchargement"
                  />
                  <FormHelperText>
                    {fieldState.error?.message ??
                      "Sélectionnez pour autoriser le téléchargement de votre vidéo."}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="is_360"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl error={Boolean(fieldState.error)}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(_, checked) => field.onChange(checked)}
                      />
                    }
                    label="Il s'agit d'une vidéo 360°"
                  />
                  <FormHelperText>
                    {fieldState.error?.message ??
                      "Sélectionnez si vous voulez utiliser le lecteur 360° pour cette vidéo."}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="disable_comment"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl error={Boolean(fieldState.error)}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(_, checked) => field.onChange(checked)}
                      />
                    }
                    label="Désactiver les commentaires"
                  />
                  <FormHelperText>
                    {fieldState.error?.message ??
                      "Sélectionnez si vous voulez désactiver l'ajout de commentaires sous votre vidéo."}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </>
        )}
      </form>
    </div>
  );
}
