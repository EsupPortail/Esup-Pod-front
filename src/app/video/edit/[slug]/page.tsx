"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm, useWatch, FieldErrors } from "react-hook-form";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { formatTime, secondToMinute } from "@/src/constants/date";
import { useTags } from "@/src/hooks/useTags";
import {
  Alert,
  Button,
  FileUploader,
  VariantType,
} from "@openfun/cunningham-react";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useVideo } from "@/src/hooks/useVideos";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import { useUsers } from "@/src/hooks/useUsers";
import { getUserDisplayName } from "@/src/constants/user";
import { useUserPermissions } from "@/src/hooks/useUserPermissions";
import { useDiscipline } from "@/src/hooks/useDiscipline";
import { useSubtitle } from "@/src/hooks/useSubtitle";
import { useTypes } from "@/src/hooks/useTypes";
import type { User, Theme } from "@/src/types";
import useMediaQuery from "@mui/material/useMediaQuery";
import styles from "./styles.module.css";
import { Chip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
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
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useVideoPermissions } from "@/src/hooks/useVideoPermission";
import dayjs from "dayjs";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useChannel } from "@/src/hooks/useChannel";
import { useChannelPermissions } from "@/src/hooks/useChannelPermissions";
import { useTheme } from "@/src/hooks/useTheme";
// MUI Icons
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TuneIcon from "@mui/icons-material/Tune";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import StyleIcon from "@mui/icons-material/Style";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import GroupIcon from "@mui/icons-material/Group";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import SwitchVideoIcon from "@mui/icons-material/SwitchVideo";
import { VideoDocumentsForm } from "@/src/components/video/VideoDocumentsForm";
import VideoChaptersForm from "@/src/components/video/edit/VideoChaptersForm";
import VideoDressingForm from "@/src/components/video/edit/VideoDressingForm";
import VideoSocialNetworksForm from "@/src/components/video/edit/VideoSocialNetworksForm";
import VideoContributorsForm from "@/src/components/video/VideoContributorsForm";
import { useDuplicate } from "@/src/hooks/useDuplicate";

export const breadcrumbLabel = "Éditer la vidéo";

function getUserLabel(user: User) {
  const fullName = getUserDisplayName(user);
  return fullName || user.username;
}

type ThemeOption = Theme & {
  depth: number;
  path: string;
};

function buildThemeOptions(themes: Theme[]): ThemeOption[] {
  const walk = (
    themeList: Theme[],
    depth = 0,
    parentPath = "",
  ): ThemeOption[] => {
    return themeList.flatMap((theme) => {
      const path = parentPath ? `${parentPath} / ${theme.title}` : theme.title;
      return [
        { ...theme, depth, path },
        ...walk(theme.children ?? [], depth + 1, path),
      ];
    });
  };
  return walk(themes);
}

// Desktop stepper steps (index 0 = Importation, 1 = Détails, 2 = Eléments vidéo, 3 = Visibilité)
const ALL_STEPS = ["Importation", "Détails", "Éléments Video", "Visibilité"];

// Mobile step keys
const MOBILE_STEPS = [
  { label: "Importation", icon: <UploadFileIcon />, index: 0 },
  { label: "Détails", icon: <ListAltIcon />, index: 1 },
  { label: "Eléments Video", icon: <TuneIcon />, index: 2 },
  { label: "Visibilité", icon: <VisibilityIcon />, index: 3 },
];

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
  publication_date: string;
  channel: number | string | "";
  themes: number[];
};

const FORM_FIELD_LABELS: Partial<Record<keyof EditVideoFormValues, string>> = {
  title: "Titre",
  description: "Description",
  status: "Statut de la vidéo",
  language: "Langue",
  thumbnail: "Vignette",
  license: "Licence",
  owner: "Propriétaire",
  co_owners: "Co-propriétaires",
  is_auth_required: "Authentification requise",
  is_password_required: "Mot de passe requis",
  password: "Mot de passe",
  disciplines: "Disciplines",
  type_id: "Type",
  tags: "Tags",
  allow_downloading: "Téléchargement",
  disable_comment: "Commentaires",
  is_360: "Vidéo 360",
  cursus: "Cursus",
  date_to_delete: "Date de suppression",
  date_of_event: "Date de l'évènement",
  channel: "Chaine",
  themes: "Thèmes",
};

export default function EditVideo() {
  const router = useRouter();
  const params = useParams();
  const getVideoSlug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;
  const isMobile = useMediaQuery("(max-width: 932px)");
  const { accessToken, refresh } = useAuth();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { config } = useAppConfig();
  const { isEmployee, isStaff, isSuperUser } = useUserPermissions();
  const { data: video, isLoading: useVideoLoading, error, refetch } = useVideo(getVideoSlug ?? "", isAuthenticated);
  const useVideoError = error?.message ?? null;
  const { fetchAll: fetchUsers, users } = useUsers();
  const { fetchAll: fetchDisciplines, discipline: disciplines } = useDiscipline();
  const { addSubtitle, deleteSubtitle, useSubtitleLoading, useSubtitleError } = useSubtitle();
  const { fetchAll: fetchTypes, types } = useTypes();
  const { tags, fetchAll: fetchTags } = useTags();
  const { channels, fetchAll: fetchChannels } = useChannel();
  const { themes, fetchAll: fetchThemes, useThemeError } = useTheme();
  const { duplicateVideo, isDuplicating } = useDuplicate(getVideoSlug ?? "");

  // Desktop stepper: starts on step index 1 (Détails), since Importation (0) is disabled
  const [activeStep, setActiveStep] = useState(1);
  // Mobile step: null = menu, 0 = Détails, 1 = Éléments, 2 = Visibilité
  const [mobilePanelIndex, setMobilePanelIndex] = useState<number | null>(null);

  const [formError, setformError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<null | (() => void)>(null);
  const [subtitleLanguage, setSubtitleLanguage] = useState<LanguageSubtitle>("fr");
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const [subtitleIsDefault, setSubtitleIsDefault] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");
  // Vignette: local URL preview for newly selected file
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);


  // Modal state for chapters, dressing, documents, contributors, subtitles
  const [chaptersModalOpen, setChaptersModalOpen] = useState(false);
  const [dressingModalOpen, setDressingModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [contributorsModalOpen, setContributorsModalOpen] = useState(false);
  const [subtitlesModalOpen, setSubtitlesModalOpen] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUploading, setSourceUploading] = useState(false);

  // Visibility accordion state
  const [restrictionExpanded, setRestrictionExpanded] = useState(true);
  const [diffusionExpanded, setDiffusionExpanded] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);

  const { isOwnerOrCoOwner } = useVideoPermissions(video ?? null);
  const { getPermissions } = useChannelPermissions();

  const channelsOptions = useMemo(
    () => channels.filter((channel) => {
      const { isOwner, isCollaborator } = getPermissions(channel);
      return isOwner || isCollaborator;
    }),
    [channels, getPermissions],
  );

  const licenseOptionsSource =
    (config as any)?.VIDEO_LICENSE_CHOICES && (config as any).VIDEO_LICENSE_CHOICES.length > 0
      ? (config as any).VIDEO_LICENSE_CHOICES
      : DEFAULT_VIDEO_LICENSE_OPTIONS;

  const licenseOptions = [
    { label: "Aucune", value: "_NONE_" },
    ...licenseOptionsSource.map((licenseCode: string) => ({
      label: licenseCode,
      value: licenseCode,
    })),
  ];

  // Fields validated per step (0=Importation, 1=Détails, 2=Éléments, 3=Visibilité)
  const STEP_REQUIRED_FIELDS: Record<number, Array<keyof EditVideoFormValues>> = {
    0: [],                  // Importation: optionnel (fiche vide)
    1: ["title"],           // Détails: title est obligatoire
    2: ["type_id"],         // Éléments Video: type est obligatoire
    3: [],                  // Visibilité: validation sur submit
  };

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
    setValue,
    getValues,
    clearErrors,
  } = useForm<EditVideoFormValues>({
    defaultValues: {
      title: "",
      description: "",
      status: "PU",
      language: "fr",
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
      publication_date: "",
      channel: "",
      themes: [],
    },
  });

  const selectedStatus = useWatch({ control, name: "status" });
  const isPasswordRequired = useWatch({ control, name: "is_password_required" });
  const watchOwner = useWatch({ control, name: "owner" });
  const watchedValues = useWatch({ control });
  const selectedChannel = useWatch({ control, name: "channel" });

  const themeOptions = useMemo(() => buildThemeOptions(themes), [themes]);
  const initialValuesRef = useRef<EditVideoFormValues | null>(null);

  const hasUnsavedChanges = useRef(false);

  // Comparaison après rendu pour détecter les modifications - l'accès à ref.current dans les callbacks est sûr
  useEffect(() => {
    if (!initialValuesRef.current) return;
    hasUnsavedChanges.current =
      JSON.stringify(initialValuesRef.current) !== JSON.stringify(watchedValues);
  }, [watchedValues]);

  useEffect(() => {
    if (!mounted || isInitializing || !isAuthenticated) return;
    fetchUsers();
    fetchDisciplines();
    fetchTypes();
    fetchTags();
    fetchChannels();
  }, [mounted, isInitializing, isAuthenticated, fetchUsers, fetchDisciplines, fetchTypes, fetchTags, fetchChannels]);

  useEffect(() => {
    if (selectedChannel === "") {
      setValue("themes", []);
      return;
    }
    fetchThemes({ channel: Number(selectedChannel) });
  }, [selectedChannel, fetchThemes, setValue]);

  const videoDiscipline = video?.discipline;
  const videoDisciplineDetails = video?.discipline_details;
  const initialDisciplineIds = useMemo(() => {
    if (videoDiscipline && videoDiscipline.length > 0) return videoDiscipline;
    return videoDisciplineDetails?.map((item) => item.id) ?? [];
  }, [videoDiscipline, videoDisciplineDetails]);

  const initialTypeId = useMemo(() => {
    if (typeof video?.type_id === "number") return video.type_id;
    if (!video?.type_name) return "";
    const matched = types.find((t) => t.title === video.type_name || t.slug === video.type_name);
    return matched?.id ?? "";
  }, [types, video]);

  const tagOptions = useMemo(() => tags.map((t) => t.name).filter(Boolean), [tags]);

  useEffect(() => {
    if (!video) return;
    const initialValues: EditVideoFormValues = {
      title: video.title ?? "",
      description: video.description ?? "",
      status: video.status ?? "PU",
      language: video.language ?? "fr",
      thumbnail: null,
      license: video.license === "" || video.license == null ? "_NONE_" : video.license,
      owner: video.owner ?? "",
      is_auth_required: video.is_auth_required ?? false,
      is_password_required: video.has_password ?? false,
      password: "",
      co_owners: video.co_owners ?? [],
      disciplines: initialDisciplineIds,
      type_id: initialTypeId,
      channel: video.channel ?? "",
      themes: video.themes ?? [],
      tags: Array.isArray(video.tags) ? video.tags.join(",") : "",
      allow_downloading: video.allow_downloading ?? false,
      disable_comment: video.disable_comment ?? false,
      is_360: video.is_360 ?? false,
      cursus: video.cursus ?? "0",
      date_to_delete: video.date_to_delete ? dayjs(video.date_to_delete).format("YYYY-MM-DD") : "",
      date_of_event: video.date_of_event ? dayjs(video.date_of_event).format("YYYY-MM-DD") : "",
      publication_date: video.publication_date ? dayjs(video.publication_date).format("YYYY-MM-DDTHH:mm") : "",
    };
    initialValuesRef.current = initialValues;
    reset(initialValues);
  }, [video, reset, initialDisciplineIds, initialTypeId]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  const openConfirmLeave = (navigationAction: () => void) => {
    if (!hasUnsavedChanges.current) {
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

  const selectedOwner = useMemo(() => {
    return users.find((user) => {
      const fullName = getUserDisplayName(user);
      return user.username === video?.owner || fullName === video?.owner;
    }) ?? null;
  }, [users, video?.owner]);

  const liveOwnerUser = useMemo(() => {
    return users.find((u) => u.username === watchOwner) || selectedOwner;
  }, [users, watchOwner, selectedOwner]);

  const liveInitials = useMemo(() => {
    if (liveOwnerUser) {
      const first = liveOwnerUser.first_name?.charAt(0) ?? "";
      const last = liveOwnerUser.last_name?.charAt(0) ?? "";
      return (first + last).toUpperCase() || liveOwnerUser.username?.charAt(0).toUpperCase() || "U";
    }
    return "U";
  }, [liveOwnerUser]);

  const availableCoOwners = useMemo(() => {
    return users.filter((user) => user.username !== watchOwner);
  }, [users, watchOwner]);

  if (!mounted || isInitializing || !isAuthenticated) return <CenteredLoader />;
  if (useVideoLoading) return <CenteredLoader />;

  if (useVideoError || !getVideoSlug) {
    return (
      <div>
        <Alert type={VariantType.ERROR} aria-live="assertive">Vidéo introuvable.</Alert>
      </div>
    );
  }

  if (useVideoError || !video) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Alert type={VariantType.ERROR} aria-live="assertive">
          {useVideoError ?? "Impossible de charger cette vidéo."}
        </Alert>
      </div>
    );
  }

  if (video && !isOwnerOrCoOwner) {
    return (
      <div>
        <Alert type={VariantType.ERROR} aria-live="assertive">
          Vous n&apos;avez pas les droits pour modifier cette vidéo.
        </Alert>
      </div>
    );
  }

  const handleNextStep = async () => {
    const fieldsToValidate = STEP_REQUIRED_FIELDS[activeStep] ?? [];
    if (fieldsToValidate.length > 0) {
      const valid = await trigger(fieldsToValidate);
      if (!valid) {
        const labels = fieldsToValidate
          .filter((f) => !!errors[f] || !getValues(f))
          .map((f) => FORM_FIELD_LABELS[f] ?? f);
        if (labels.length > 0) {
          setformError(
            `Veuillez remplir le(s) champ(s) obligatoire(s) avant de continuer : ${labels.join(", ")}.`
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
    }
    setformError(null);
    setActiveStep((c) => Math.min(c + 1, ALL_STEPS.length - 1));
  };
  const handlePreviousStep = () => {
    setformError(null);
    setActiveStep((c) => Math.max(c - 1, 0));
  };
  const handleStepClick = async (idx: number) => {
    if (idx > activeStep) {
      for (let step = activeStep; step < idx; step++) {
        const fieldsToValidate = STEP_REQUIRED_FIELDS[step] ?? [];
        if (fieldsToValidate.length > 0) {
          const valid = await trigger(fieldsToValidate);
          if (!valid) {
            const labels = fieldsToValidate
              .filter((f) => !!errors[f] || !getValues(f))
              .map((f) => FORM_FIELD_LABELS[f] ?? f);
            if (labels.length > 0) {
              setformError(
                `Veuillez remplir le(s) champ(s) obligatoire(s) de l'étape "${ALL_STEPS[step]}" avant de continuer : ${labels.join(", ")}.`
              );
              window.scrollTo({ top: 0, behavior: "smooth" });
              setActiveStep(step);
            }
            return;
          }
        }
      }
    }
    setformError(null);
    setActiveStep(idx);
  };

  /* -------------------------- Vignette -------------------------- */
  const removeThumbnail = () => {
    setValue("thumbnail", null);
    setThumbnailPreview(null);
  };

  const handleThumbnailChange = (file: File | null) => {
    setValue("thumbnail", file, { shouldValidate: Boolean(file) });
    if (!file) {
      clearErrors("thumbnail");
      setThumbnailPreview(null);
    } else {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  /* -------------------------- Sous-titres -------------------------- */
  const usedSubtitleLanguages = new Set(
    (video?.subtitles ?? []).map((s) => s.language.toLowerCase()),
  );

  const handleAddSubtitle = async () => {
    setformError(null);
    setSuccess(null);
    if (!video?.id) { setformError("Impossible d'ajouter un sous‑titre à cette vidéo."); return; }
    if (!subtitleFile) { setformError("Veuillez sélectionner un fichier de sous‑titre."); return; }
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
      await refetch();
    }
  };

  const handleDeleteSubtitle = async (subtitleId: number) => {
    setformError(null);
    setSuccess(null);
    const deleted = await deleteSubtitle(subtitleId);
    if (deleted) await refetch();
  };

  /* -------------------------- Duplication -------------------------- */
  const handleDuplicate = async () => {
    try {
      const result = await duplicateVideo() as any;
      if (result?.slug) {
        router.push(`/video/edit/${result.slug}`);
      }
    } catch (e: any) {
      setformError(e.message || "Erreur lors de la duplication.");
    }
  };

  /* -------------------------- Change source -------------------------- */
  const handleSourceChange = async () => {
    if (!sourceFile || !video?.slug) return;
    setSourceUploading(true);
    try {
      const fd = new FormData();
      fd.append("video_file", sourceFile);
      const res = await authFetch(getRoutes().video.update(video.slug), {
        accessToken, onRefresh: refresh,
        method: "PATCH",
        body: fd,
      });
      if (!res.ok) throw new Error("Erreur lors du changement de source.");
      if (res.ok) {
        setSuccess("Source vidéo mise à jour. Re-encodage lancé.");
        setSourceModalOpen(false);
        setSourceFile(null);
        await refetch();
        setActiveStep(1);
        setMobilePanelIndex(1);
      }
    } catch (e: any) {
      setformError(e.message || "Erreur lors du changement de source.");
    } finally {
      setSourceUploading(false);
    }
  };


  /* -------------------------- Submit form -------------------------- */
  const onSubmit = async (data: EditVideoFormValues) => {
    setformError(null);
    setSuccess(null);
    if (!accessToken) { setformError("Vous devez être connecté·e pour modifier cette vidéo."); return; }
    if (data.status === "PU" && !video?.has_video_file && !video?.video_url && !sourceFile) {
      setformError("Aucun fichier source n'a été importé à l'étape Importation. La fiche ne peut pas être publiée en mode Public.");
      setActiveStep(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (data.status === "RE" && !data.is_auth_required && !data.is_password_required) {
      setformError("Pour un statut restreint, choisissez au moins une restriction.");
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
      if (data.publication_date) {
        formData.append("publication_date", data.publication_date);
      }
      if (data.channel !== "") {
        formData.append("channel", String(data.channel));
        data.themes.forEach((id) => formData.append("theme", String(id)));
      } else {
        formData.append("channel", "");
      }
      data.co_owners.forEach((id) => formData.append("co_owners", String(id)));
      if (data.status === "RE") {
        formData.append("is_auth_required", String(Boolean(data.is_auth_required)));
      } else {
        formData.append("is_auth_required", "false");
      }
      if (data.is_password_required && data.password.trim()) {
        formData.append("password", data.password.trim());
      } else if (video?.has_password) {
        formData.append("password", "");
      }
      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
      formData.append("owner", data.owner);
      data.disciplines.forEach((id) => formData.append("disciplines", String(id)));
      if (data.type_id !== "") formData.append("type_id", String(data.type_id));
      data.tags.split(",").map((t) => t.trim()).filter(Boolean).forEach((t) => formData.append("tags", t));

      const res = await authFetch(getRoutes().video.update(getVideoSlug), {
        method: "PATCH",
        body: formData,
        accessToken,
        onRefresh: refresh,
      });

      if (res.ok) {
        setSuccess("Vidéo mise à jour avec succès ! 🥳");
        router.push("/dashboard");
        window.scrollTo({ top: 0, behavior: "smooth" });
        initialValuesRef.current = { ...data, thumbnail: null, password: "" };
        reset(initialValuesRef.current);
      }
      await requestJson(res);
    } catch (err: unknown) {
      setformError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  const onInvalid = (formErrors: FieldErrors<EditVideoFormValues>) => {
    const fieldNames = Object.keys(formErrors) as Array<keyof EditVideoFormValues>;
    const labels = fieldNames.map((fieldName) => FORM_FIELD_LABELS[fieldName] ?? fieldName);
    setSuccess(null);
    setformError(
      labels.length > 1
        ? `Veuillez corriger les ${labels.length} champs suivants : ${labels.join(", ")}.`
        : `Veuillez corriger le champ suivant : ${labels[0]}.`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* -----------------------------------------------------------------------
   *  Submit Handler Wrapper
   * --------------------------------------------------------------------- */
  const onFormSubmit = (e?: React.BaseSyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    void handleSubmit(onSubmit, onInvalid)(e);
  };

  /* -----------------------------------------------------------------------
   *  Step content renderers
   * --------------------------------------------------------------------- */

  const renderImportStep = () => {
    const hasSource = Boolean(video?.has_video_file || video?.video_url || sourceFile);
    const isPublicEmpty = selectedStatus === "PU" && !hasSource;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--c--globals--colors--gray-600)", marginTop: 0 }}>
          Gérez la vidéo source et l&apos;encodage de votre média.
        </p>

        {isPublicEmpty && (
          <div style={{ margin: "4px 0 8px" }}>
            <Alert type={VariantType.ERROR} canClose={false}>
              <b>Importation obligatoire pour publication publique</b> : Vous avez sélectionné le statut <b>Public</b> mais aucun fichier source n&apos;est importé. Veuillez importer un fichier vidéo ci-dessous.
            </Alert>
          </div>
        )}

        {!hasSource ? (
          <div
            style={{
              padding: "16px 20px",
              background: "#fffbebf5",
              border: "1.5px solid #fcd34d",
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ fontWeight: 700, color: "#b45309", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 8 }}>
              Fiche vide sans source vidéo
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400e", lineHeight: 1.5 }}>
              Cette vidéo n&apos;a pas encore de fichier source associé. Vous pouvez compléter les métadonnées (titre, description, etc.), mais <b>vous devez ajouter une vidéo source ci-dessous avant de pouvoir la publier</b>.
            </p>
          </div>
        ) : (
          <div
            style={{
              padding: "16px 20px",
              background: "#f0fdf4",
              border: "1.5px solid #bbf7d0",
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ fontWeight: 700, color: "#15803d", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 8 }}>
              ✅ Fichier source associé
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#166534" }}>
              Source actuelle : <b>{String(video?.video_url || sourceFile?.name || "").split("/").pop()}</b>
              {video?.encoding_status_label ? ` • Statut d'encodage : ${video.encoding_status_label}` : ""}
            </p>
          </div>
        )}

        <div
          style={{
            padding: "20px",
            background: "white",
            border: isPublicEmpty ? "1.5px solid #d32f2f" : "1.5px solid #e5e7eb",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#111" }}>
            {hasSource ? "Remplacer le fichier source vidéo" : "Ajouter un fichier vidéo"}
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
            Sélectionnez un fichier vidéo depuis votre ordinateur. Un nouveau processus d&apos;encodage sera automatiquement lancé.
          </p>

          <FileUploader
            text="Glissez un fichier vidéo ici ou cliquez pour parcourir"
            accept={config?.encoding?.allowed_extensions?.map((ext: string) => `.${ext}`).join(", ") || ".mp4,.avi,.mkv"}
            onChange={(e: any) => {
              const file = e?.target?.files?.[0] || e || null;
              setSourceFile(file);
              if (file) {
                setActiveStep(1);
                setMobilePanelIndex(1);
              }
            }}
          />

          {sourceFile && (
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151", fontWeight: 500 }}>
              📹 Fichier sélectionné : {sourceFile.name}
            </p>
          )}

          <button
            type="button"
            className={`${styles.action_pill_btn} ${styles.primary}`}
            style={{ alignSelf: "flex-start" }}
            disabled={!sourceFile || sourceUploading}
            onClick={handleSourceChange}
          >
            <SwitchVideoIcon fontSize="small" />
            {sourceUploading ? "Envoi et re-encodage..." : (hasSource ? "Remplacer et re-encoder" : "Ajouter la vidéo")}
          </button>
        </div>
      </div>
    );
  };

  const renderDetailsStep = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title */}
      <Controller
        name="title"
        control={control}
        rules={{ required: "Le titre est obligatoire." }}
        render={({ field }) => (
          <div className={styles.input_group}>
            <label className={styles.input_label}>
              Titre <span className={styles.required_star}>*</span> <span className={styles.lang_indicator}>FR <ExpandMoreIcon style={{ fontSize: 14, verticalAlign: 'middle' }} /></span>
            </label>
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              placeholder="Titre de la vidéo en Français"
              error={Boolean(errors.title)}
              helperText={errors.title?.message ?? "Un titre aussi court et précis que possible, reflétant le sujet principal / le contexte de ce contenu. (taille maximale : 250 caractères)"}
              InputProps={{ style: { borderRadius: '8px' } }}
            />
          </div>
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div className={styles.input_group}>
            <label className={styles.input_label}>
              Description <span className={styles.required_star}>*</span> <span className={styles.lang_indicator}>FR <ExpandMoreIcon style={{ fontSize: 14, verticalAlign: 'middle' }} /></span>
            </label>
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Description de la vidéo en Français"
              helperText="Décrivez votre contenu, ajoutez toutes les informations nécessaires, et mettez en forme le résultat en utilisant la barre d'outils."
              InputProps={{ style: { borderRadius: '8px' } }}
            />
          </div>
        )}
      />

      {/* Language */}
      <Controller
        name="language"
        control={control}
        render={({ field }) => (
          <div className={styles.input_group}>
            <label className={styles.input_label}>
              Langue principale <span className={styles.required_star}>*</span>
            </label>
            <TextField
              {...field}
              select
              fullWidth
              variant="outlined"
              helperText="La langue principalement utilisée dans ce contenu."
              InputProps={{ style: { borderRadius: '8px' } }}
            >
              {(config?.video?.metadata_languages || VIDEO_LANGUAGE_OPTIONS).map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        )}
      />

      {/* Thumbnail */}
      <div className={styles.input_group}>
        <label className={styles.input_label}>Vignettes</label>
        <div className={styles.vignette_area}>
          {/* Preview zone */}
          {(thumbnailPreview ?? video?.thumbnail) ? (
            <div className={styles.vignette_preview_card}>
              <img
                src={thumbnailPreview || video?.thumbnail || undefined}
                alt="Vignette"
                className={styles.vignette_preview_img}
              />
              <div className={styles.vignette_overlay}>
                <label htmlFor="thumbnail-input" className={styles.vignette_overlay_btn}>
                  <UploadFileIcon fontSize="small" /> Changer
                </label>
                <button
                  type="button"
                  className={`${styles.vignette_overlay_btn} ${styles.vignette_overlay_btn_danger}`}
                  onClick={removeThumbnail}
                >
                  <DeleteOutlineIcon fontSize="small" /> Supprimer
                </button>
              </div>
            </div>
          ) : (
            <label htmlFor="thumbnail-input" className={styles.vignette_empty_zone}>
              <div className={styles.vignette_empty_icon}>
                <UploadFileIcon style={{ fontSize: 32, color: "var(--c--globals--colors--primary-600, #00818a)" }} />
              </div>
              <span className={styles.vignette_empty_title}>+ Importer une vignette</span>
              <span className={styles.vignette_empty_hint}>JPG ou PNG · Recommandé : 1280 × 720 px</span>
            </label>
          )}
          <input
            id="thumbnail-input"
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              handleThumbnailChange(file);
              e.target.value = "";
            }}
          />
        </div>
        <p className={styles.vignette_helper_text}>
          La vignette doit respecter les règles de la communauté. Assurez-vous que l&apos;image a le bon droit d&apos;auteur.
        </p>
        {errors.thumbnail && (
          <p style={{ color: "var(--c--globals--colors--error-600, #d32f2f)", fontSize: "0.8rem", margin: "4px 0 0" }}>
            {errors.thumbnail.message}
          </p>
        )}
      </div>

      {/* Owner (staff only) */}
      {isStaff && (
        <Controller
          name="owner"
          control={control}
          render={({ field }) => (
            <div className={styles.input_group}>
              <label className={styles.input_label}>
                Propriétaire <span className={styles.required_star}>*</span>
              </label>
              <Autocomplete
                options={users}
                value={users.find((u) => u.username === field.value) ?? selectedOwner}
                onChange={(_, newVal) => field.onChange(newVal?.username ?? "")}
                getOptionLabel={getUserLabel}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                renderInput={(params) => (
                  <TextField {...params} fullWidth variant="outlined" helperText="Un super‑utilisateur peut changer le propriétaire d'une vidéo." InputProps={{ ...params.InputProps, style: { borderRadius: '8px' } }} />
                )}
              />
            </div>
          )}
        />
      )}

      {/* Co-owners */}
      <Controller
        name="co_owners"
        control={control}
        render={({ field }) => (
          <div className={styles.input_group}>
            <label className={styles.input_label}>Propriétaires additionnels</label>
            <Autocomplete
              multiple
              options={availableCoOwners}
              value={availableCoOwners.filter((u) => field.value?.includes(u.id))}
              onChange={(_, newVal) => field.onChange(newVal.map((u) => u.id))}
              getOptionLabel={getUserLabel}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" helperText="Les propriétaires additionnels auront les mêmes droits que vous, sauf qu'ils ne peuvent pas supprimer ce contenu." InputProps={{ ...params.InputProps, style: { borderRadius: '8px' } }} />
              )}
            />
          </div>
        )}
      />

      {/* License */}
      <Controller
        name="license"
        control={control}
        render={({ field }) => (
          <div className={styles.input_group}>
            <label className={styles.input_label}>Licence</label>
            <TextField {...field} select fullWidth variant="outlined" helperText="Droits d'utilisation de votre contenu." InputProps={{ style: { borderRadius: '8px' } }}>
              {licenseOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </div>
        )}
      />


      {/* Channel & Themes */}
      {channelsOptions.length > 0 && (
        <>
          <Divider />
          <Controller
            name="channel"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                label="Chaine"
                value={field.value === "" ? "_NONE_" : field.value}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value === "_NONE_" ? "" : Number(value));
                }}
                helperText="Vous avez les permissions pour associer cette vidéo à une chaine."
                slotProps={{ inputLabel: { shrink: true } }}
              >
                <MenuItem value="_NONE_">Aucune</MenuItem>
                {channelsOptions.map((channel) => (
                  <MenuItem key={channel.id} value={channel.id}>{channel.title}</MenuItem>
                ))}
              </TextField>
            )}
          />

          {selectedChannel !== "" && themeOptions.length > 0 && (
            <Controller
              name="themes"
              control={control}
              render={({ field }) => {
                const selectedIds = field.value ?? [];
                return (
                  <TextField
                    select
                    fullWidth
                    label="Thèmes"
                    value={selectedIds}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange((typeof value === "string" ? value.split(",") : value).map(Number));
                    }}
                    helperText={useThemeError ?? "Vous pouvez sélectionner un ou plusieurs thèmes liés à la chaine."}
                    error={Boolean(useThemeError)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      select: {
                        multiple: true,
                        displayEmpty: true,
                        renderValue: (selected) => {
                          const ids = selected as number[];
                          if (ids.length === 0) return <Box component="span" sx={{ color: "text.disabled" }}>Sélectionnez un ou plusieurs thèmes</Box>;
                          return themeOptions.filter((theme) => ids.includes(theme.id)).map((theme) => theme.path).join(", ");
                        },
                      },
                    }}
                  >
                    {themeOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id} sx={{ pl: `${2 + option.depth * 3}rem` }}>
                        <Checkbox checked={selectedIds.includes(option.id)} sx={{ mr: 1 }} />
                        <Box component="span" sx={{ fontWeight: option.depth === 0 ? 700 : 400 }}>{option.title}</Box>
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }}
            />
          )}
        </>
      )}

      {/* Dates */}
      <Divider />
      <Controller
        name="date_to_delete"
        control={control}
        render={({ field }) => (
          <DatePicker
            disabled={!(isStaff || isEmployee || isSuperUser)}
            label="Date de suppression"
            value={field.value ? dayjs(field.value) : null}
            onChange={(v) => field.onChange(v ? dayjs(v).format("YYYY-MM-DD") : "")}
            slotProps={{ textField: { fullWidth: true, helperText: "Date planifiée de suppression de la vidéo. Seul un super‑utilisateur/staff peut la modifier." } }}
          />
        )}
      />
      <Controller
        name="date_of_event"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Date de l'événement"
            value={field.value ? dayjs(field.value) : null}
            onChange={(v) => field.onChange(v ? dayjs(v).format("YYYY-MM-DD") : "")}
            slotProps={{ textField: { fullWidth: true, helperText: "Date de l'événement lié à cette vidéo." } }}
          />
        )}
      />
      <Controller
        name="publication_date"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value || ""}
            fullWidth
            type="datetime-local"
            label="Date et heure de publication planifiée"
            slotProps={{ inputLabel: { shrink: true } }}
            helperText="Définissez une date/heure dans le futur à laquelle la vidéo sera rendue publique."
            InputProps={{ style: { borderRadius: '8px' } }}
          />
        )}
      />
    </div>
  );

  const renderElementsStep = () => {
    const hasEncodedSource = Boolean(video?.has_video_file || video?.video_url || sourceFile);

    return (
      <>
        <p style={{ fontSize: "0.875rem", color: "var(--c--globals--colors--gray-600)", marginTop: 0 }}>
          Enrichissez votre vidéo avec des sous-titres, chapitres, documents, contributeurs et un habillage visuel.
        </p>

        <div className={styles.elements_list}>
          {/* Sous-titres manuels */}
          <div className={styles.element_card}>
            <div className={styles.element_card_info}>
              <span className={styles.element_card_title}>Sous-titres manuels</span>
              <span className={styles.element_card_desc}>
                Ajoutez des fichiers de sous-titres (.vtt, .srt) dans une ou plusieurs langues.
                {video?.subtitles?.length ? ` — ${video.subtitles.length} sous-titre(s) actif(s)` : ""}
              </span>
            </div>
            <div className={styles.element_card_actions}>
              <button
                className={styles.element_action_btn}
                type="button"
                disabled={!video}
                onClick={() => setSubtitlesModalOpen(true)}
              >
                <SubtitlesIcon fontSize="small" /> Gérer les sous-titres
              </button>
            </div>
          </div>

          {/* Documents joints */}
          <div className={styles.element_card}>
            <div className={styles.element_card_info}>
              <span className={styles.element_card_title}>Documents joints</span>
              <span className={styles.element_card_desc}>
                Associez des fichiers PDF, diaporamas ou autres documents à cette vidéo.
              </span>
            </div>
            <div className={styles.element_card_actions}>
              <button
                className={styles.element_action_btn}
                type="button"
                disabled={!video}
                onClick={() => setDocumentsModalOpen(true)}
              >
                <AttachFileIcon fontSize="small" /> Gérer les documents
              </button>
            </div>
          </div>

          {/* Contributeurs */}
          <div className={styles.element_card}>
            <div className={styles.element_card_info}>
              <span className={styles.element_card_title}>Contributeurs &amp; Intervenants</span>
              <span className={styles.element_card_desc}>
                Ajoutez des auteurs, réalisateurs ou intervenants à votre vidéo.
              </span>
            </div>
            <div className={styles.element_card_actions}>
              <button
                className={styles.element_action_btn}
                type="button"
                disabled={!video}
                onClick={() => setContributorsModalOpen(true)}
              >
                <GroupIcon fontSize="small" /> Gérer les contributeurs
              </button>
            </div>
          </div>

          {/* Chapitrage */}
          <div className={styles.element_card} style={{ opacity: hasEncodedSource ? 1 : 0.65 }}>
            <div className={styles.element_card_info}>
              <span className={styles.element_card_title}>Chapitrer la vidéo</span>
              <span className={styles.element_card_desc}>
                Découpez votre vidéo en chapitres avec des marqueurs dans la barre de progression (style YouTube).
              </span>
            </div>
            <div className={styles.element_card_actions}>
              <button
                className={styles.element_action_btn}
                type="button"
                disabled={!hasEncodedSource}
                onClick={() => setChaptersModalOpen(true)}
              >
                <BookmarksIcon fontSize="small" /> Gérer les chapitres
              </button>
            </div>
          </div>

          {/* Habillage */}
          {config?.dressing?.use_dressing !== false && (
            <div className={styles.element_card} style={{ opacity: hasEncodedSource ? 1 : 0.65 }}>
              <div className={styles.element_card_info}>
                <span className={styles.element_card_title}>Habiller la vidéo</span>
                <span className={styles.element_card_desc}>
                  Appliquez un habillage (filigrane, amorce d&apos;ouverture / fermeture) à cette vidéo.
                </span>
              </div>
              <div className={styles.element_card_actions}>
                <button
                  className={styles.element_action_btn}
                  type="button"
                  disabled={!hasEncodedSource}
                  onClick={() => setDressingModalOpen(true)}
                >
                  <StyleIcon fontSize="small" /> Choisir un habillage
                </button>
              </div>
            </div>
          )}

          {/* Découpage */}
          <div className={styles.element_card} style={{ opacity: hasEncodedSource ? 1 : 0.65 }}>
            <div className={styles.element_card_info}>
              <span className={styles.element_card_title}>Découper la vidéo</span>
              <span className={styles.element_card_desc}>
                Définissez un point d&apos;entrée et de sortie pour raccourcir votre vidéo.
              </span>
            </div>
            <div className={styles.element_card_actions}>
              <button
                className={styles.element_action_btn}
                type="button"
                disabled={!hasEncodedSource}
              >
                <ContentCutIcon fontSize="small" /> Découper
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderVisibilityStep = () => {
    const hasSource = Boolean(video?.has_video_file || video?.video_url || sourceFile);
    const isPublicWithoutSource = selectedStatus === "PU" && !hasSource;

    return (
      <>
        <p style={{ fontSize: "0.875rem", color: "var(--c--globals--colors--gray-600)", marginTop: 0 }}>
          Choisissez quand publier votre vidéo et qui peut la voir
        </p>

        {/* Restrictions section */}
        <div className={styles.visibility_section}>
          <button
            type="button"
            className={styles.visibility_section_header}
            onClick={() => setRestrictionExpanded(!restrictionExpanded)}
          >
            <span>Restrictions</span>
            <ExpandMoreIcon style={{ transform: restrictionExpanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />
          </button>
          {restrictionExpanded && (
            <div className={styles.visibility_section_content}>
              <p style={{ fontSize: "0.8rem", color: "var(--c--globals--colors--gray-500)", margin: "0 0 8px" }}>
                Choisissez de rendre votre vidéo publique, non répertoriée ou privée
              </p>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <div className={styles.radio_option}>
                      <Radio value="DR" size="small" sx={{ mt: "-3px" }} />
                      <div className={styles.radio_option_content}>
                        <h4>Brouillon / Privé</h4>
                        <p>En mode &ldquo;Brouillon / Privé&rdquo;, le contenu n&apos;apparaît nulle part et personne d&apos;autre que vous ne peut le voir. Vous pouvez ajouter des jetons pour permettre un accès direct par lien.</p>
                        {selectedStatus === "DR" && (
                          <button type="button" className={styles.element_action_btn} style={{ marginTop: 8 }}>
                            Intégrer/Partager
                          </button>
                        )}
                      </div>
                    </div>
                    <Divider />
                    <div className={styles.radio_option}>
                      <Radio value="RE" size="small" sx={{ mt: "-3px" }} />
                      <div className={styles.radio_option_content}>
                        <h4>Accès restreint</h4>
                        <p>En mode &ldquo;Accès restreint&rdquo;, vous pouvez choisir les restrictions pour la vidéo. Voir cette vidéo n&apos;est pas possible sans mot de passe.</p>
                      </div>
                    </div>
                    <Divider />
                    <div className={styles.radio_option}>
                      <Radio value="PU" size="small" sx={{ mt: "-3px" }} />
                      <div className={styles.radio_option_content}>
                        <h4>Public</h4>
                        <p>Dans le mode &ldquo;Public&rdquo;, le contenu est visible par tout le monde.</p>
                        {isPublicWithoutSource && (
                          <div style={{ marginTop: 8, padding: "8px 12px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, color: "#991b1b", fontSize: "0.825rem", display: "flex", alignItems: "center", gap: 6 }}>
                            Impossible d&apos;activer le mode Public sans fichier source. Veuillez d&apos;abord ajouter une vidéo à l&apos;étape <b>Importation</b>.
                          </div>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                )}
              />
              {selectedStatus === "RE" && (
                <div style={{ marginTop: 8, padding: "12px", background: "var(--c--globals--colors--gray-050)", borderRadius: 6 }}>
                  <p style={{ fontWeight: 600, margin: "0 0 8px", fontSize: "0.875rem" }}>Options de restriction :</p>
                  <Controller
                    name="is_auth_required"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={Boolean(fieldState.error)}>
                        <FormControlLabel
                          control={<Checkbox checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />}
                          label="Authentification requise"
                        />
                        <FormHelperText>{fieldState.error?.message ?? "Limiter l'accès aux personnes authentifiées."}</FormHelperText>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="is_password_required"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />}
                        label="Mot de passe requis"
                      />
                    )}
                  />
                  {isPasswordRequired && (
                    <Controller
                      name="password"
                      control={control}
                      rules={{ validate: (value) => value.trim().length === 0 || value.trim().length >= 4 || "Le mot de passe doit contenir au moins 4 caractères." }}
                      render={({ field }) => (
                        <TextField {...field} fullWidth type="password" autoComplete="new-password" label="Mot de passe de la vidéo" error={Boolean(errors.password)} helperText={errors.password?.message ?? "Laissez vide pour ne pas modifier le mot de passe existant."} />
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Diffusion config */}
        <div className={styles.visibility_section}>
          <button type="button" className={styles.visibility_section_header} onClick={() => setDiffusionExpanded(!diffusionExpanded)}>
            <div>
              <span>Configuration de la Diffusion</span>
            </div>
            <ExpandMoreIcon style={{ transform: diffusionExpanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />
          </button>
          {diffusionExpanded && (
            <div className={styles.visibility_section_content}>
              {config?.video?.enable_downloads !== false && (
                <Controller
                  name="allow_downloading"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={Boolean(fieldState.error)}>
                      <FormControlLabel control={<Checkbox checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />} label="Autoriser le téléchargement" />
                      <FormHelperText>{fieldState.error?.message ?? "Autoriser le téléchargement de votre vidéo."}</FormHelperText>
                    </FormControl>
                  )}
                />
              )}
              {config?.video?.enable_comments !== false && (
                <Controller
                  name="disable_comment"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={Boolean(fieldState.error)}>
                      <FormControlLabel control={<Checkbox checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />} label="Désactiver les commentaires" />
                      <FormHelperText>{fieldState.error?.message ?? "Désactiver l'ajout de commentaires sous votre vidéo."}</FormHelperText>
                    </FormControl>
                  )}
                />
              )}
              {video && <VideoSocialNetworksForm video={video!} onNetworksUpdated={() => refetch()} />}
            </div>
          )}
        </div>

        {/* Advanced */}
        <div className={styles.visibility_section}>
          <button type="button" className={styles.visibility_section_header} onClick={() => setAdvancedExpanded(!advancedExpanded)}>
            <div>
              <span>Options avancées</span>
            </div>
            <ExpandMoreIcon style={{ transform: advancedExpanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />
          </button>
          {advancedExpanded && (
            <div className={styles.visibility_section_content}>
              <Controller
                name="is_360"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl error={Boolean(fieldState.error)}>
                    <FormControlLabel control={<Checkbox checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />} label="Il s'agit d'une vidéo 360°" />
                    <FormHelperText>{fieldState.error?.message ?? "Activer le lecteur 360° pour cette vidéo."}</FormHelperText>
                  </FormControl>
                )}
              />
            </div>
          )}
        </div>
      </>
    );
  };

  /* -----------------------------------------------------------------------
   *  Video preview sidebar
   * --------------------------------------------------------------------- */
  const renderVideoPreview = () => {
    const titleVal = watchedValues.title || video?.title || "Titre de la vidéo";
    const statusVal = watchedValues.status;
    const isAuthRequiredVal = watchedValues.is_auth_required;
    const isPasswordRequiredVal = watchedValues.is_password_required;

    const ownerName = liveOwnerUser
      ? getUserDisplayName(liveOwnerUser)
      : (video?.owner || "Propriétaire");

    const viewsCount = video?.views ?? 0;

    return (
      <div className={styles.preview_card_wrapper}>
        <div className={styles.live_card_container}>
          {/* Media 16:9 */}
          <div className={styles.live_card_media_wrapper}>
            {(thumbnailPreview || video?.thumbnail) ? (
              <img
                src={thumbnailPreview || video?.thumbnail || undefined}
                alt="Aperçu"
                className={styles.live_card_img}
              />
            ) : (
              <div className={styles.live_card_media_placeholder}>
                <OndemandVideoIcon style={{ fontSize: 40, opacity: 0.3 }} />
              </div>
            )}

            {/* Duration bubble */}
            {video?.duration && (
              <div className={styles.live_card_duration}>
                {formatTime(secondToMinute(video.duration))}
              </div>
            )}

            {/* Encoding overlay if active */}
            {video?.encoding_status && video.encoding_status !== "DO" && (
              <div className={styles.live_card_encoding_overlay}>
                <div className={styles.live_card_encoding_progress_bar} style={{ width: video.encoding_status === "PE" ? "30%" : "65%" }}></div>
                <div className={styles.live_card_encoding_text}>
                  {video.encoding_status_label || "Encodage..."}
                </div>
              </div>
            )}
          </div>

          {/* Details below */}
          <div className={styles.live_card_details}>
            <Avatar sx={{ width: 32, height: 32, mt: 0.5, bgcolor: "var(--c--globals--colors--primary-600, #00818a)", fontSize: "0.85rem", fontWeight: 600 }}>
              {liveInitials}
            </Avatar>

            <div className={styles.live_card_info_block}>
              <div className={styles.live_card_header_row}>
                <div className={styles.live_card_title} title={titleVal}>
                  {titleVal}
                </div>

                {/* Badges based on form state */}
                <div className={styles.live_card_badges}>
                  {statusVal === "DR" && (
                    <Tooltip title="Vidéo privée">
                      <span className="material-icons" style={{ fontSize: "1rem", color: "var(--c--globals--colors--gray-500)" }}>visibility_off</span>
                    </Tooltip>
                  )}
                  {isPasswordRequiredVal && (
                    <Tooltip title="Vidéo protégée par mot de passe">
                      <span className="material-icons" style={{ fontSize: "1rem", color: "var(--c--globals--colors--gray-500)" }}>key</span>
                    </Tooltip>
                  )}
                  {isAuthRequiredVal && (
                    <Tooltip title="Authentification requise">
                      <span className="material-icons" style={{ fontSize: "1rem", color: "var(--c--globals--colors--gray-500)" }}>verified_user</span>
                    </Tooltip>
                  )}
                </div>
              </div>

              <div className={styles.live_card_meta}>
                {ownerName}
              </div>

              <div className={styles.live_card_stats}>
                {viewsCount} {viewsCount > 1 ? "vues" : "vue"} • {video?.created_at ? dayjs(video.created_at).format("DD/MM/YYYY") : "Récemment"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* -----------------------------------------------------------------------
   *  MOBILE: menu overview and step panels
   * --------------------------------------------------------------------- */
  if (isMobile) {
    return (
      <div>
        {/* Alerts */}
        {formError && <Alert canClose type={VariantType.ERROR} aria-live="assertive">{formError}</Alert>}
        {useSubtitleError && <Alert canClose type={VariantType.ERROR} aria-live="assertive">{useSubtitleError}</Alert>}
        {success && <Alert canClose type={VariantType.SUCCESS} aria-live="polite">{success}</Alert>}

        <form className={styles.form} noValidate onSubmit={onFormSubmit}>
          {/* Header */}
          <div className={styles.page_header}>
            <h1 className={styles.page_title}>Éditer la vidéo</h1>
            <div className={styles.header_actions}>
              <button type="submit" className={`${styles.action_pill_btn} ${styles.primary}`} disabled={isSubmitting}>
                <SaveIcon fontSize="small" /> Sauvegarder
              </button>
            </div>
          </div>

          {/* Video preview at top on mobile */}
          {renderVideoPreview()}

          {/* Video title + views chip */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ fontWeight: 600 }}>{video?.title}</span>
            {video?.views != null && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.875rem", color: "var(--c--globals--colors--gray-600)" }}>
                <VisibilityIcon fontSize="small" /> {video?.views}
              </span>
            )}
          </div>

          {/* Navigation menu or step content */}
          {mobilePanelIndex === null ? (
            <div className={styles.mobile_menu_list}>
              {MOBILE_STEPS.map((step) => (
                <button
                  key={step.label}
                  type="button"
                  className={styles.mobile_menu_item}
                  onClick={() => step.index >= 0 && setMobilePanelIndex(step.index)}
                  disabled={step.index < 0}
                  style={step.index < 0 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                >
                  <span className={styles.mobile_menu_item_icon}>{step.icon}</span>
                  <span>{step.label}</span>
                  <ChevronRightIcon className={styles.mobile_menu_item_chevron} />
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button
                type="button"
                className={styles.mobile_back_btn}
                onClick={() => setMobilePanelIndex(null)}
              >
                <ChevronLeftIcon fontSize="small" />
                {MOBILE_STEPS.find((s) => s.index === mobilePanelIndex)?.label ?? "Retour"}
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {mobilePanelIndex === 0 && renderImportStep()}
                {mobilePanelIndex === 1 && renderDetailsStep()}
                {mobilePanelIndex === 2 && renderElementsStep()}
                {mobilePanelIndex === 3 && renderVisibilityStep()}
              </div>
            </div>
          )}
        </form>

        <Dialog open={confirmLeaveOpen} onClose={handleCancelLeave} PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle>Modifications non enregistrées</DialogTitle>
          <DialogContent>Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?</DialogContent>
          <DialogActions>
            <Button type="button" variant="secondary" color="neutral" onClick={handleCancelLeave}>Rester sur la page</Button>
            <Button type="button" variant="secondary" color="brand" onClick={handleConfirmLeave}>Quitter sans enregistrer</Button>
          </DialogActions>
        </Dialog>

        {/* Chapters Modal */}
        <Dialog open={chaptersModalOpen} onClose={() => setChaptersModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
            <BookmarksIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
            Chapitres de la vidéo
          </DialogTitle>
          <DialogContent dividers>
            {video && <VideoChaptersForm video={video!} />}
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="secondary" color="neutral" onClick={() => setChaptersModalOpen(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>

        {/* Dressing Modal */}
        <Dialog open={dressingModalOpen} onClose={() => setDressingModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
            <StyleIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
            Habillage de la vidéo
          </DialogTitle>
          <DialogContent dividers>
            {video && <VideoDressingForm video={video!} onDressingUpdated={() => refetch()} />}
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="secondary" color="neutral" onClick={() => setDressingModalOpen(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>

        {/* Subtitles Modal */}
        <Dialog open={subtitlesModalOpen} onClose={() => setSubtitlesModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
            <SubtitlesIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
            Sous-titres manuels
          </DialogTitle>
          <DialogContent dividers>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                Ajoutez des sous-titres au format <b>.vtt</b> ou <b>.srt</b>. Chaque fichier correspond à une langue.
              </p>
              {video?.subtitles?.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {video?.subtitles?.map((s) => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "white" }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.language.toUpperCase()}</span>
                        {s.is_default && <span style={{ marginLeft: 8, fontSize: "0.75rem", background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 999 }}>Par défaut</span>}
                      </div>
                      <Button type="button" size="small" color="warning" variant="secondary" disabled={useSubtitleLoading} onClick={() => handleDeleteSubtitle(s.id)}>Supprimer</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.875rem", margin: 0 }}>Aucun sous-titre ajouté.</p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, background: "#f9fafb", borderRadius: 10, border: "1.5px solid #e5e7eb" }}>
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Ajouter un sous-titre</span>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <TextField select label="Langue" value={subtitleLanguage} onChange={(e) => setSubtitleLanguage(e.target.value as LanguageSubtitle)} size="small" sx={{ minWidth: 140 }} InputProps={{ style: { borderRadius: 10 } }}>
                    {SUBTITLE_LANGUAGE_OPTIONS.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                  </TextField>
                  <FormControlLabel control={<Checkbox checked={subtitleIsDefault} onChange={(e) => setSubtitleIsDefault(e.target.checked)} size="small" />} label="Par défaut" />
                </div>
                <FileUploader text="Sélectionner un fichier .vtt ou .srt" accept=".vtt,.srt" onChange={(e: any) => setSubtitleFile(e?.target?.files?.[0] || e || null)} />
                {subtitleFile && <p style={{ margin: 0, fontSize: "0.8rem", color: "#374151" }}>📄 {subtitleFile?.name}</p>}
                <Button type="button" color="brand" disabled={!subtitleFile || useSubtitleLoading} onClick={async () => { await handleAddSubtitle(); await refetch(); }}>
                  {useSubtitleLoading ? "Ajout en cours…" : "Ajouter le sous-titre"}
                </Button>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="secondary" color="neutral" onClick={() => setSubtitlesModalOpen(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>

        {/* Documents Modal */}
        <Dialog open={documentsModalOpen} onClose={() => setDocumentsModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
            <AttachFileIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
            Documents joints
          </DialogTitle>
          <DialogContent dividers>
            {video && <VideoDocumentsForm videoId={video!.id} />}
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="secondary" color="neutral" onClick={() => setDocumentsModalOpen(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>

        {/* Contributors Modal */}
        <Dialog open={contributorsModalOpen} onClose={() => setContributorsModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
            <GroupIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
            Contributeurs &amp; Intervenants
          </DialogTitle>
          <DialogContent dividers>
            {video && <VideoContributorsForm videoId={video!.id} />}
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="secondary" color="neutral" onClick={() => setContributorsModalOpen(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>

        {/* Source Modal */}
        <Dialog open={sourceModalOpen} onClose={() => { setSourceModalOpen(false); setSourceFile(null); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
            <SwitchVideoIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
            Changer la source vidéo
          </DialogTitle>
          <DialogContent dividers>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "4px 0" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Remplacez le fichier source de cette vidéo. Un nouveau processus d&apos;encodage sera lancé.</p>
              <FileUploader text="Sélectionner un nouveau fichier vidéo" accept={config?.encoding?.allowed_extensions?.map((ext: string) => `.${ext}`).join(", ") || ".mp4,.avi,.mkv"} onChange={(e: any) => setSourceFile(e?.target?.files?.[0] || e || null)} />
              {sourceFile && <p style={{ margin: 0, fontSize: "0.8rem", color: "#374151" }}>📹 {sourceFile?.name}</p>}
            </div>
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="secondary" color="neutral" onClick={() => { setSourceModalOpen(false); setSourceFile(null); }}>Annuler</Button>
            <Button type="button" color="brand" disabled={!sourceFile || sourceUploading} onClick={handleSourceChange}>{sourceUploading ? "Upload…" : "Remplacer"}</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }


  /* -----------------------------------------------------------------------
   *  DESKTOP: 2-column layout with stepper
   * --------------------------------------------------------------------- */
  // Map desktop activeStep (1,2,3) to form panel (0,1,2)
  const formPanelIndex = activeStep - 1; // 0=Détails, 1=Éléments, 2=Visibilité

  return (
    <div>
      {/* Alerts */}
      {formError && <Alert canClose type={VariantType.ERROR} aria-live="assertive">{formError}</Alert>}
      {useSubtitleError && <Alert canClose type={VariantType.ERROR} aria-live="assertive">{useSubtitleError}</Alert>}
      {success && <Alert canClose type={VariantType.SUCCESS} aria-live="polite">{success}</Alert>}

      <form className={styles.form} noValidate onSubmit={onFormSubmit}>
        {/* Page header: title + action buttons */}
        <div className={styles.page_header}>
          <h1 className={styles.page_title}>Éditer la vidéo « {video?.title} »</h1>
          <div className={styles.header_actions}>
            <button type="button" className={styles.action_pill_btn} onClick={handleDuplicate} disabled={isDuplicating}>
              <FileCopyIcon fontSize="small" /> {isDuplicating ? "Duplication…" : "Dupliquer"}
            </button>
            <button type="submit" className={`${styles.action_pill_btn} ${styles.primary}`} disabled={isSubmitting}>
              <SaveIcon fontSize="small" /> Enregistrer
            </button>
            <button type="button" className={styles.action_pill_btn} onClick={() => openConfirmLeave(() => router.push(`/video/${getVideoSlug}`))}>
              <CloseIcon fontSize="small" /> Quitter la page
            </button>
          </div>
        </div>

        {/* Formik-style Stepper with validation indicators */}
        <div className={styles.stepper_wrapper}>
          <div className={styles.custom_stepper}>
            <div className={styles.stepper_line_bg}></div>
            <div className={styles.stepper_line_progress} style={{ width: `${(activeStep / (ALL_STEPS.length - 1)) * 100}%` }}></div>
            {ALL_STEPS.map((label, index) => {
              const isActive = index === activeStep;

              // Validation & completion logic
              const isStep0Error = Boolean(watchedValues.status === "PU" && !video?.has_video_file && !video?.video_url && !sourceFile);
              const isStep1Error = Boolean(errors.title || errors.type_id || (!watchedValues.title?.trim() && isSubmitted));
              const isStep3Error = Boolean(watchedValues.status === "PU" && !video?.has_video_file && !video?.video_url && !sourceFile);
              const isError = (index === 0 && isStep0Error) || (index === 1 && isStep1Error) || (index === 3 && isStep3Error);

              const isCompleted = !isError && (
                (index === 0 && Boolean(video?.has_video_file || video?.video_url || sourceFile)) ||
                (index === 1 && Boolean(watchedValues.title?.trim() && watchedValues.type_id && !errors.title && !errors.type_id)) ||
                (index === 2 && Boolean(video?.subtitles?.length || video?.documents?.length || video?.co_owners?.length)) ||
                (index === 3 && Boolean(watchedValues.status))
              );

              let itemClass = styles.stepper_item;
              if (isActive) itemClass += ` ${styles.stepper_item_active}`;
              if (isCompleted && !isActive) itemClass += ` ${styles.stepper_item_completed}`;
              if (isError) itemClass += ` ${styles.stepper_item_error}`;

              return (
                <div
                  key={label}
                  className={itemClass}
                  onClick={() => handleStepClick(index)}
                  style={{ cursor: index > 0 ? "pointer" : "default" }}
                >
                  <div className={styles.stepper_dot}>
                    {isError ? (
                      <PriorityHighIcon style={{ fontSize: 18 }} />
                    ) : isCompleted && !isActive ? (
                      <CheckIcon style={{ fontSize: 18 }} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={styles.stepper_label}>{label}</span>
                  {isError && (
                    <span className={styles.stepper_badge_status} style={{ background: "#ffebee", color: "#d32f2f" }}>
                      Incomplet
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step header: step title + Previous/Next */}
        <div className={styles.step_header}>
          <div>
            <h2 className={styles.step_title}>
              {ALL_STEPS[activeStep]}
            </h2>
            {activeStep === 1 && (
              <p className={styles.step_sub_title}>Les champs marqués d&apos;un <span className={styles.required_star}>*</span> sont obligatoires.</p>
            )}
            {activeStep === 3 && (
              <p className={styles.step_sub_title}>Choisissez quand publier votre vidéo et qui peut la voir.</p>
            )}
            {activeStep === 2 && (
              <p className={styles.step_sub_title}>Enrichissez votre vidéo avec des sous-titres, documents et contributeurs.</p>
            )}
          </div>
          <div className={styles.step_nav}>
            <button
              type="button"
              className={styles.step_nav_btn}
              disabled={activeStep <= 1}
              onClick={handlePreviousStep}
            >
              Précédent
            </button>
            {activeStep < ALL_STEPS.length - 1 ? (
              <button
                type="button"
                className={styles.step_nav_btn}
                onClick={handleNextStep}
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                className={styles.step_nav_btn}
                onClick={onFormSubmit}
              >
                Valider
              </button>
            )}
          </div>
        </div>

        <Divider />

        {/* 2-column layout */}
        <div className={styles.form_layout}>
          <div className={styles.form_left}>
            {activeStep === 0 && renderImportStep()}
            {activeStep === 1 && renderDetailsStep()}
            {activeStep === 2 && renderElementsStep()}
            {activeStep === 3 && renderVisibilityStep()}
          </div>
          <div className={styles.form_right}>
            {renderVideoPreview()}
          </div>
        </div>
      </form>

      {/* Confirm leave dialog */}
      <Dialog open={confirmLeaveOpen} onClose={handleCancelLeave} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Modifications non enregistrées</DialogTitle>
        <DialogContent>
          Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?
        </DialogContent>
        <DialogActions>
          <Button type="button" variant="secondary" color="neutral" onClick={handleCancelLeave}>Rester sur la page</Button>
          <Button type="button" variant="secondary" color="brand" onClick={handleConfirmLeave}>Quitter sans enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Chapters Modal */}
      <Dialog open={chaptersModalOpen} onClose={() => setChaptersModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <BookmarksIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
          Chapitres de la vidéo
        </DialogTitle>
        <DialogContent dividers>
          {video && <VideoChaptersForm video={video!} />}
        </DialogContent>
        <DialogActions>
          <Button type="button" variant="secondary" color="neutral" onClick={() => setChaptersModalOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dressing Modal */}
      <Dialog open={dressingModalOpen} onClose={() => setDressingModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <StyleIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
          Habillage de la vidéo
        </DialogTitle>
        <DialogContent dividers>
          {video && <VideoDressingForm video={video!} onDressingUpdated={() => refetch()} />}
        </DialogContent>
        <DialogActions>
          <Button type="button" variant="secondary" color="neutral" onClick={() => setDressingModalOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Subtitles Modal */}
      <Dialog open={subtitlesModalOpen} onClose={() => setSubtitlesModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <SubtitlesIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
          Sous-titres manuels
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
              Ajoutez des sous-titres au format <b>.vtt</b> ou <b>.srt</b>. Chaque fichier correspond à une langue.
            </p>

            {/* Existing subtitles */}
            {video?.subtitles?.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {video?.subtitles?.map((s) => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "white" }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.language.toUpperCase()}</span>
                      {s.is_default && <span style={{ marginLeft: 8, fontSize: "0.75rem", background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 999 }}>Par défaut</span>}
                    </div>
                    <Button type="button" size="small" color="warning" variant="secondary" disabled={useSubtitleLoading} onClick={() => handleDeleteSubtitle(s.id)}>
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.875rem", margin: 0 }}>Aucun sous-titre ajouté.</p>
            )}

            {/* Add new subtitle */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, background: "#f9fafb", borderRadius: 10, border: "1.5px solid #e5e7eb" }}>
              <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Ajouter un sous-titre</span>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <TextField
                  select
                  label="Langue"
                  value={subtitleLanguage}
                  onChange={(e) => setSubtitleLanguage(e.target.value as LanguageSubtitle)}
                  size="small"
                  sx={{ minWidth: 140 }}
                  InputProps={{ style: { borderRadius: 10 } }}
                >
                  {SUBTITLE_LANGUAGE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={<Checkbox checked={subtitleIsDefault} onChange={(e) => setSubtitleIsDefault(e.target.checked)} size="small" />}
                  label="Par défaut"
                />
              </div>
              <FileUploader
                text="Sélectionner un fichier .vtt ou .srt"
                accept=".vtt,.srt"
                onChange={(e: any) => setSubtitleFile(e?.target?.files?.[0] || e || null)}
              />
              {subtitleFile && <p style={{ margin: 0, fontSize: "0.8rem", color: "#374151" }}>📄 {subtitleFile?.name}</p>}
              <Button
                type="button"
                color="brand"
                disabled={!subtitleFile || useSubtitleLoading}
                onClick={async () => { await handleAddSubtitle(); await refetch(); }}
              >
                {useSubtitleLoading ? "Ajout en cours…" : "Ajouter le sous-titre"}
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="button" variant="secondary" color="neutral" onClick={() => setSubtitlesModalOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Documents Modal */}
      <Dialog open={documentsModalOpen} onClose={() => setDocumentsModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <AttachFileIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
          Documents joints
        </DialogTitle>
        <DialogContent dividers>
          {video && <VideoDocumentsForm videoId={video!.id} />}
        </DialogContent>
        <DialogActions>
          <Button type="button" variant="secondary" color="neutral" onClick={() => setDocumentsModalOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Contributors Modal */}
      <Dialog open={contributorsModalOpen} onClose={() => setContributorsModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <GroupIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
          Contributeurs &amp; Intervenants
        </DialogTitle>
        <DialogContent dividers>
          {video && <VideoContributorsForm videoId={video!.id} />}
        </DialogContent>
        <DialogActions>
          <Button type="button" variant="secondary" color="neutral" onClick={() => setContributorsModalOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Source change Modal */}
      <Dialog open={sourceModalOpen} onClose={() => { setSourceModalOpen(false); setSourceFile(null); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <SwitchVideoIcon sx={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
          Changer la source vidéo
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "4px 0" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
              Remplacez le fichier source de cette vidéo. Un nouveau processus d&apos;encodage sera automatiquement lancé.
            </p>
            {video?.video_url && (
              <div style={{ padding: "10px 14px", background: "#f9fafb", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.85rem", color: "#374151" }}>
                <span style={{ fontWeight: 600 }}>Source actuelle :</span> {String(video?.video_url).split("/").pop()}
              </div>
            )}
            <FileUploader
              text="Sélectionner un nouveau fichier vidéo"
              accept={config?.encoding?.allowed_extensions?.map((ext: string) => `.${ext}`).join(", ") || ".mp4,.avi,.mkv"}
              onChange={(e: any) => setSourceFile(e?.target?.files?.[0] || e || null)}
            />
            {sourceFile && <p style={{ margin: 0, fontSize: "0.8rem", color: "#374151" }}>📹 {sourceFile?.name}</p>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="button" variant="secondary" color="neutral" onClick={() => { setSourceModalOpen(false); setSourceFile(null); }}>Annuler</Button>
          <Button type="button" color="brand" disabled={!sourceFile || sourceUploading} onClick={handleSourceChange}>
            {sourceUploading ? "Upload en cours…" : "Remplacer la source"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
