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
import { useTags } from "@/src/hooks/useTags";
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
import { useIsEmployee } from "@/src/hooks/useIsEmployee";
import { useDiscipline } from "@/src/hooks/useDiscipline";
import { useSubtitle } from "@/src/hooks/useSubtitle";
import { useTypes } from "@/src/hooks/useTypes";
import type { User } from "@/src/types";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import styles from "./styles.module.css";
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
import BackButton from "@/src/components/BackButton/BackButton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useVideoPermissions } from "@/src/hooks/useVideoPermission";
import dayjs, { Dayjs } from "dayjs";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useChannel } from "@/src/hooks/useChannel";

export const breadcrumbLabel = "Éditer la vidéo";

function getUserLabel(user: User) {
  const fullName = getUserDisplayName(user);
  return fullName || user.username;
}

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
  date_to_delete: string;
  date_of_event: string;
  channel: number | "";
};

export default function EditVideo() {
  const params = useParams();
  const getVideoSlug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;
  const isMobile = useMediaQuery("(max-width: 932px)");
  const { accessToken, refresh } = useAuth();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { config } = useAppConfig();
  const { isStaff } = useIsStaff();
  const { isEmployee } = useIsEmployee();
  const { fetchOne, video, useVideoLoading, useVideoError } = useVideos();
  const { fetchAll: fetchUsers, users } = useUsers();
  const { fetchAll: fetchDisciplines, discipline: disciplines } =
    useDiscipline();
  const { addSubtitle, deleteSubtitle, useSubtitleLoading, useSubtitleError } =
    useSubtitle();
  const { fetchAll: fetchTypes, types } = useTypes();
  const { tags, fetchAll: fetchTags } = useTags();
  const { channels, fetchAll: fetchChannels } = useChannel();
  const [activeStep, setActiveStep] = useState(0);
  const [formError, setformError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [subtitleLanguage, setSubtitleLanguage] =
    useState<LanguageSubtitle>("fr");
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const [subtitleIsDefault, setSubtitleIsDefault] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");
  const { canEdit } = useVideoPermissions(video);

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
    getValues,
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
      date_to_delete: "",
      date_of_event: "",
      channel: "",
    },
  });

  const selectedStatus = useWatch({ control, name: "status" });
  const isPasswordRequired = useWatch({
    control,
    name: "is_password_required",
  });
  const watchOwner = useWatch({ control, name: "owner" });

  /* -------------------------- Effets de chargement -------------------------- */
  useEffect(() => {
    if (!getVideoSlug || !isAuthenticated) return;
    fetchOne(getVideoSlug);
  }, [getVideoSlug, fetchOne, isAuthenticated]);

  useEffect(() => {
    if (!mounted || isInitializing || !isAuthenticated) return;
    fetchUsers();
    fetchDisciplines();
    fetchTypes();
    fetchTags();
    fetchChannels();
  }, [
    mounted,
    isInitializing,
    isAuthenticated,
    fetchUsers,
    fetchDisciplines,
    fetchTypes,
    fetchTags,
    fetchChannels,
  ]);

  const initialDisciplineIds = useMemo(() => {
    if (video?.discipline && video.discipline.length > 0) {
      return video.discipline;
    }
    return video?.discipline_details?.map((item) => item.id) ?? [];
  }, [video?.discipline, video?.discipline_details]);

  /* fait la correspondance entre le nom reçu et l’ID attendu, en cherchant dans la liste des types chargés*/

  const initialTypeId = useMemo(() => {
    if (typeof video?.type_id === "number") return video.type_id;
    if (!video?.type_name) return "";
    const matched = types.find(
      (t) => t.title === video.type_name || t.slug === video.type_name,
    );
    return matched?.id ?? "";
  }, [types, video]);

  const tagOptions = useMemo(
    () => tags.map((t) => t.name).filter(Boolean),
    [tags],
  );

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
      channel: video.channel ?? "",
      tags: Array.isArray(video.tags) ? video.tags.join(",") : "",
      allow_downloading: video.allow_downloading ?? false,
      disable_comment: video.disable_comment ?? false,
      is_360: video.is_360 ?? false,
      cursus: video.cursus ?? "0",
      date_to_delete: video.date_to_delete
        ? dayjs(video.date_to_delete).format("YYYY-MM-DD")
        : "",
      date_of_event: video.date_of_event
        ? dayjs(video.date_of_event).format("YYYY-MM-DD")
        : "",
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
        <Alert canClose type="error" role="alert" aria-live="assertive">
          Vidéo introuvable.
        </Alert>
        <Link href="/dashboard">
          <Button color="brand" variant="secondary" type="reset">
            Retour au tableau de bord
          </Button>
        </Link>
      </div>
    );
  }

  if (useVideoError || !video) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Alert canClose type="error" role="alert" aria-live="assertive">
          {useVideoError ?? "Impossible de charger cette vidéo."}
        </Alert>
        <BackButton label="Retour" />
      </div>
    );
  }

  if (video && !canEdit) {
    return (
      <div>
        <Alert type="error" role="alert" aria-live="assertive">
          Vous n’avez pas les droits pour modifier cette vidéo.
        </Alert>
        <BackButton label="Retour" />
      </div>
    );
  }

  /* -------------------------- Gestion du stepper -------------------------- */
  const handleNextStep = () => {
    setActiveStep((c) => Math.min(c + 1, formSteps.length - 1));
  };
  const handlePreviousStep = () => {
    setActiveStep((c) => Math.max(c - 1, 0));
  };
  const handleStepClick = (idx: number) => setActiveStep(idx);

  /* -------------------------- Vignette -------------------------- */
  const removeThumbnail = () => {
    setValue("thumbnail", null);
    const el = document.getElementById("thumbnail-preview");
    el?.remove();
  };

  /* -------------------------- Sous‑titres -------------------------- */
  const usedSubtitleLanguages = new Set(
    (video?.subtitles ?? []).map((s) => s.language.toLowerCase()),
  );

  const handleAddSubtitle = async () => {
    setformError(null);
    setSuccess(null);
    if (!video?.id) {
      setformError("Impossible d’ajouter un sous‑titre à cette vidéo.");
      return;
    }
    if (!subtitleFile) {
      setformError("Veuillez sélectionner un fichier de sous‑titre.");
      return;
    }
    const created = await addSubtitle({
      video: video.id,
      language: subtitleLanguage,
      file: subtitleFile,
      is_default: subtitleIsDefault,
    });
    if (created) {
      setSubtitleFile(null);
      setSubtitleLanguage("fr");
      setSubtitleIsDefault(false);
      await fetchOne(getVideoSlug);
    }
  };

  const handleDeleteSubtitle = async (subtitleId: number) => {
    setformError(null);
    setSuccess(null);
    const deleted = await deleteSubtitle(subtitleId);
    if (deleted) await fetchOne(getVideoSlug);
  };

  /* -------------------------- Submit form -------------------------- */
  const onSubmit = async (data: EditVideoFormValues) => {
    setformError(null);
    setSuccess(null);
    if (!accessToken) {
      setformError("Vous devez être connecté·e pour modifier cette vidéo.");
      return;
    }
    if (
      data.status === "RE" &&
      !data.is_auth_required &&
      !data.is_password_required
    ) {
      setformError(
        "Pour un statut restreint, choisissez au moins une restriction.",
      );
      return;
    }

    try {
      const normalizedLicense = data.license === "_NONE_" ? "" : data.license;
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("status", data.status);
      formData.append("language", data.language);
      formData.append("license", normalizedLicense);
      formData.append("allow_downloading", String(data.allow_downloading));
      formData.append("is_360", String(data.is_360));
      formData.append("disable_comment", String(data.disable_comment));
      formData.append("cursus", data.cursus);
      formData.append("date_to_delete", data.date_to_delete);
      formData.append("date_of_event", data.date_of_event);
      formData.append(
        "channel",
        data.channel === "" ? "" : String(data.channel),
      );
      data.co_owners.forEach((id) => formData.append("co_owners", String(id)));

      if (data.status === "RE") {
        formData.append(
          "is_auth_required",
          String(Boolean(data.is_auth_required)),
        );
      } else {
        formData.append("is_auth_required", "false");
        if (data.is_password_required && data.password.trim()) {
          formData.append("password", data.password.trim());
        } else if (video?.has_password) {
          formData.append("password", "");
        }
      }

      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
      formData.append("owner", data.owner);
      data.disciplines.forEach((id) =>
        formData.append("disciplines", String(id)),
      );
      if (data.type_id !== "") formData.append("type_id", String(data.type_id));
      data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => formData.append("tags", t));

      const res = await authFetch(getRoutes().video.update(getVideoSlug), {
        method: "PATCH",
        body: formData,
        accessToken,
        onRefresh: refresh,
      });

      if (res.ok) {
        setSuccess("Vidéo mise à jour avec succès ! 🥳");
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

  /* -------------------------- RENDER -------------------------- */
  return (
    <div>
      <BackButton label="Retour" />

      <h1>Éditer la vidéo « {video?.title} »</h1>

      {/* ---------- Alertes globales ---------- */}
      {formError && (
        <Alert canClose type="error" role="alert" aria-live="assertive">
          {formError}
        </Alert>
      )}
      {useSubtitleError && (
        <Alert canClose type="error" role="alert" aria-live="assertive">
          {useSubtitleError}
        </Alert>
      )}
      {success && (
        <Alert canClose type="success" role="alert" aria-live="polite">
          {success}
        </Alert>
      )}

      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* ----------- Boutons actions ----------- */}
        <div className={styles.form_actions}>
          <Alert>Statut de l’encodage : {video?.encoding_status_label}</Alert>
          <div className={styles.form_actions_buttons}>
            <Link href={`/video/${getVideoSlug}`}>
              <Button
                fullWidth={isMobile}
                size="small"
                color="brand"
                variant="bordered"
                type="reset"
                icon={<RemoveRedEyeIcon aria-hidden="true" />}
                iconPosition="right"
              >
                Voir la vidéo
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button
                fullWidth={isMobile}
                size="small"
                color="brand"
                variant="secondary"
                type="reset"
              >
                Retour au tableau de bord
              </Button>
            </Link>

            <Link href={`/video/delete/${getVideoSlug}`}>
              <Button
                fullWidth={isMobile}
                size="small"
                color="error"
                variant="primary"
                type="button"
              >
                Supprimer la vidéo
              </Button>
            </Link>

            <Button
              fullWidth={isMobile}
              size="small"
              type="submit"
              color="success"
              variant="primary"
              disabled={isSubmitting || useVideoLoading}
            >
              Enregistrer
            </Button>
          </div>
        </div>

        {/* ----------------- Stepper ----------------- */}
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

        {/* =========================================================
          STEP 0 – Détails
        ========================================================= */}
        {activeStep === 0 && (
          <>
            {/* ---------- Titre ---------- */}
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

            {/* ---------- Description ---------- */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  helperText="Décrivez le contenu et/ou le contexte de votre vidéo."
                />
              )}
            />

            {/* ---------- Langue principale ---------- */}
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Langue principale"
                  helperText="Sélectionnez la langue utilisée dans la vidéo."
                >
                  {VIDEO_LANGUAGE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* ---------- Dates (suppression / évènement) ---------- */}
            <Controller
              name="date_to_delete"
              control={control}
              render={({ field }) => (
                <DatePicker
                  disabled={!isStaff || !isEmployee}
                  label="Date de suppression"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(v) => {
                    const fmt = v ? dayjs(v).format("YYYY-MM-DD") : "";
                    field.onChange(fmt);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText:
                        "Date planifiée de suppression de la vidéo. Seul un super‑utilisateur peut la modifier.",
                    },
                  }}
                />
              )}
            />

            <Controller
              name="date_of_event"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Date de l’événement"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(v) => {
                    const fmt = v ? dayjs(v).format("YYYY-MM-DD") : "";
                    field.onChange(fmt);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: "Date de l’événement lié à cette vidéo.",
                    },
                  }}
                />
              )}
            />

            <Divider />

            {/* ---------- Vignette ---------- */}
            <div className={styles.thumbnail_field}>
              <FileUploader
                id="thumbnail"
                bigText="Ajouter une vignette"
                state={errors.thumbnail ? "error" : "default"}
                aria-label="Uploader une vignette"
                aria-describedby="thumbnail-help"
                onFilesChange={(event) => {
                  const file = event.target.value?.[0] ?? null;
                  setValue("thumbnail", file, {
                    shouldValidate: Boolean(file),
                  });
                  if (!file) clearErrors("thumbnail");
                }}
                accept=".jpg,.png"
                text={
                  errors.thumbnail?.message ? (
                    errors.thumbnail.message
                  ) : (
                    <p id="thumbnail-help">
                      Illustrez votre vidéo en ajoutant une vignette : formats
                      supportés png, jpg.
                    </p>
                  )
                }
              />
              <div id="thumbnail-preview">
                {video?.thumbnail && (
                  <div className={styles.thumbnail_preview}>
                    <p>Vignette actuelle :</p>
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
                      Supprimer la vignette{" "}
                      <DeleteOutlineIcon aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {/* ---------- Propriétaire & co‑propriétaires (staff) ---------- */}
            {isStaff && (
              <Controller
                name="owner"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={users}
                    value={
                      users.find((u) => u.username === field.value) ??
                      selectedOwner
                    }
                    onChange={(_, newVal) =>
                      field.onChange(newVal?.username ?? "")
                    }
                    getOptionLabel={getUserLabel}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Propriétaire"
                        helperText="Un super‑utilisateur peut changer le propriétaire d’une vidéo."
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
                  value={availableCoOwners.filter((u) =>
                    field.value?.includes(u.id),
                  )}
                  onChange={(_, newVal) =>
                    field.onChange(newVal.map((u) => u.id))
                  }
                  getOptionLabel={getUserLabel}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Co‑propriétaires"
                      helperText="Sélectionnez un ou plusieurs co‑propriétaires."
                    />
                  )}
                />
              )}
            />

            {/* ---------- Licence ---------- */}
            <Controller
              name="license"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Licence"
                  helperText="Choisissez la licence de publication."
                >
                  {licenseOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Divider />
            {/* ---------- Chaine et themes (staff only) ---------- */}
            <Controller
              name="channel"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Chaine"
                  helperText="Sélectionnez une chaine (optionnel)."
                >
                  <MenuItem value="">Sélectionnez une chaine</MenuItem>
                  {channels.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </>
        )}

        {/* =========================================================
          STEP 1 – Éléments vidéo (sous‑titres, disciplines, etc.)
        ========================================================= */}
        {activeStep === 1 && (
          <>
            <Divider />
            {/* ---------- Sous‑titres ---------- */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h3>Gérer les sous‑titres</h3>
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {video?.subtitles?.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <p>Sous‑titres déjà ajoutés :</p>
                    {video.subtitles.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>
                          Version {s.language.toUpperCase()}
                          {s.is_default && " • Par défaut"}
                        </span>
                        <Button
                          type="button"
                          size="small"
                          color="warning"
                          variant="secondary"
                          disabled={useSubtitleLoading}
                          onClick={() => handleDeleteSubtitle(s.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Chip
                    label="Aucun sous‑titre ajouté pour le moment."
                    sx={{
                      backgroundColor: "var(--background-brand-secondary)",
                      color: "var(--background-brand)",
                      marginLeft: "14px",
                      fontSize: "var(--c--globals--font--sizes--sm)",
                      fontWeight: "var(--c--globals--font--weights--bold)",
                      marginBottom: "var(--c--globals--spacings--xs)",
                    }}
                  />
                )}

                <p>Ajouter un sous‑titre :</p>
                <TextField
                  select
                  fullWidth
                  label="Langue du sous‑titre"
                  value={subtitleLanguage}
                  onChange={(e) =>
                    setSubtitleLanguage(e.target.value as LanguageSubtitle)
                  }
                >
                  {SUBTITLE_LANGUAGE_OPTIONS.map((opt) => (
                    <MenuItem
                      key={opt.value}
                      value={opt.value}
                      disabled={usedSubtitleLanguages.has(
                        opt.value.toLowerCase(),
                      )}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>

                <FileUploader
                  id="subtitle-file"
                  bigText="Ajouter un sous‑titre"
                  state={subtitleFile ? "success" : "default"}
                  onFilesChange={(e) => {
                    const file = e.target.value?.[0] ?? null;
                    setSubtitleFile(file);
                  }}
                  accept=".vtt,.srt"
                  text={
                    subtitleFile ? (
                      <p>Fichier sélectionné : {subtitleFile.name}</p>
                    ) : (
                      <p>Formats supportés : `.vtt`, `.srt`.</p>
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
                  label="Définir comme sous‑titre par défaut"
                />

                <Button
                  type="button"
                  disabled={useSubtitleLoading || !subtitleFile}
                  onClick={handleAddSubtitle}
                >
                  Ajouter le sous‑titre
                </Button>
              </AccordionDetails>
            </Accordion>

            <Divider />

            {/* ---------- Disciplines ---------- */}
            <Controller
              name="disciplines"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={disciplines}
                  value={disciplines.filter((d) => field.value?.includes(d.id))}
                  onChange={(_, newVal) =>
                    field.onChange(newVal.map((d) => d.id))
                  }
                  getOptionLabel={(opt) => opt.title}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
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

            {/* ---------- Cursus ---------- */}
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
                  {CURSUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* ---------- Type ---------- */}
            <Controller
              name="type_id"
              control={control}
              rules={{ required: "Le type de la vidéo est obligatoire." }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  select
                  fullWidth
                  label="Type"
                  error={Boolean(errors.type_id)}
                  helperText={
                    errors.type_id?.message ??
                    "Sélectionnez le type de la vidéo."
                  }
                >
                  <MenuItem value="" disabled>
                    Sélectionnez un type
                  </MenuItem>
                  {types.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* ---------- Tags ---------- */}
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={tagOptions}
                  value={
                    field.value
                      ? field.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                      : []
                  }
                  inputValue={tagInputValue}
                  onInputChange={(_, newVal) => {
                    if (newVal.includes(" ")) {
                      const splitted = newVal
                        .split(/\s+/)
                        .map((t) => t.trim())
                        .filter(Boolean);
                      const current = field.value
                        ? field.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        : [];
                      const merged = Array.from(
                        new Set([...current, ...splitted]),
                      );
                      field.onChange(merged.join(","));
                      setTagInputValue("");
                    } else {
                      setTagInputValue(newVal);
                    }
                  }}
                  onChange={(_, newVal) => {
                    const normalized = newVal
                      .map((t) => t.trim())
                      .filter(Boolean);
                    field.onChange(normalized.join(","));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((opt, i) => {
                      const { key, ...tagProps } = getTagProps({ index: i });
                      return <Chip key={key} label={opt} {...tagProps} />;
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      helperText="Saisissez ou sélectionnez des tags (séparés par un espace)."
                    />
                  )}
                />
              )}
            />
          </>
        )}

        {/* =========================================================
          STEP 2 – Visibilité / restrictions
        ========================================================= */}
        {activeStep === 2 && (
          <>
            {/* ---------- Statut vidéo ---------- */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Statut de la vidéo"
                  helperText="Choisissez le niveau de visibilité de la vidéo."
                >
                  {VIDEO_STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* ---------- Messages selon le statut ---------- */}
            {selectedStatus === "PU" && (
              <div className={styles.restreint_fields}>
                <p>Votre vidéo sera visible par tous les utilisateurs.</p>
              </div>
            )}
            {selectedStatus === "DR" && (
              <div className={styles.restreint_fields}>
                <p>Votre vidéo sera visible uniquement par vous.</p>
              </div>
            )}
            {selectedStatus === "RE" && (
              <fieldset className={styles.restreint_fields}>
                <legend>Restrictions d’accès</legend>
                <p>
                  Pour restreindre l’accès à la vidéo, choisissez au moins une
                  des options suivantes :
                </p>

                {/* ---------- Authentification requise ---------- */}
                <Controller
                  name="is_auth_required"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (getValues("status") !== "RE") return true;
                      const auth = Boolean(value);
                      const pwd = Boolean(getValues("is_password_required"));
                      return (
                        auth ||
                        pwd ||
                        "Choisissez au moins une option de restriction."
                      );
                    },
                  }}
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
                          "Limiter l’accès aux personnes authentifiées."}
                      </FormHelperText>
                    </FormControl>
                  )}
                />

                {/* ---------- Mot de passe requis ---------- */}
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
                          "Protéger la vidéo par mot de passe."}
                      </FormHelperText>
                    </FormControl>
                  )}
                />

                {/* ---------- Champ mot de passe (visible uniquement si requis) ---------- */}
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
              </fieldset>
            )}

            {/* ---------- Options supplémentaires ---------- */}
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
                      "Autoriser le téléchargement de votre vidéo."}
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
                    label="Il s’agit d’une vidéo 360°"
                  />
                  <FormHelperText>
                    {fieldState.error?.message ??
                      "Activer le lecteur 360° pour cette vidéo."}
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
                      "Désactiver l’ajout de commentaires sous votre vidéo."}
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
