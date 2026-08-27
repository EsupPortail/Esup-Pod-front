"use client";

import { useState, useCallback, useMemo } from "react";
import type { MouseEvent } from "react";
import {
  Button,
  Modal,
  ModalSize,
  VariantType,
} from "@openfun/cunningham-react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import ListItemButton from "@mui/material/ListItemButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockIcon from "@mui/icons-material/Lock";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import type { Video, Type as VideoType, Discipline, Tags } from "@/src/types";
import { useBulkActions } from "@/src/hooks/useBulkActions";
import filterStyles from "@/src/components/video/filters/styles.module.css";

export interface BulkActionsBarProps {
  selectedVideos: Video[];
  types: VideoType[];
  disciplines: Discipline[];
  tags: Tags[];
  channels: (number | string)[];
  onApplySuccess: () => void;
  onClearSelection: () => void;
}

export type BulkActionKey =
  | ""
  | "type"
  | "channel"
  | "description"
  | "status"
  | "is_auth_required"
  | "license"
  | "date_evt"
  | "date_delete"
  | "tags"
  | "discipline"
  | "cursus"
  | "allow_downloading"
  | "disable_comment"
  | "delete";

/**
 * Définition d'une action groupée avec ses conditions d'activation.
 *
 * condition: (videos) => true = toujours disponible
 * condition: (videos) => false = jamais (selon critères)
 * conditionLabel: message explicatif affiché en tooltip si désactivée
 */
interface ActionOption {
  value: BulkActionKey;
  label: string;
  group: "edit" | "danger";
  /** Retourne true si l'action est applicable sur la sélection courante */
  condition: (videos: Video[]) => boolean;
  /** Message affiché si la condition n'est pas satisfaite */
  conditionLabel?: string;
}

const ALL_ENCODED = (videos: Video[]) =>
  videos.length > 0 && videos.every((v) => v.encoding_status === "DO");

const SOME_ENCODING = (videos: Video[]) =>
  videos.some((v) => v.encoding_status === "PE" || v.encoding_status === "PR");

const getActionsOptions = (t: (key: string) => string): ActionOption[] => [
  // ── Métadonnées (toujours disponibles) ─────────────────────────
  {
    value: "type",
    label: t("bulk.changeType"),
    group: "edit",
    condition: () => true,
  },
  {
    value: "channel",
    label: t("bulk.changeChannel"),
    group: "edit",
    condition: () => true,
  },
  {
    value: "description",
    label: t("bulk.editDescription"),
    group: "edit",
    condition: () => true,
  },
  {
    value: "license",
    label: t("bulk.changeLicense"),
    group: "edit",
    condition: () => true,
  },
  {
    value: "date_evt",
    label: t("bulk.setEventDate"),
    group: "edit",
    condition: () => true,
  },
  {
    value: "tags",
    label: t("bulk.addReplaceKeywords"),
    group: "edit",
    condition: () => true,
  },
  {
    value: "discipline",
    label: t("bulk.changeDiscipline"),
    group: "edit",
    condition: () => true,
  },
  {
    value: "cursus",
    label: t("bulk.changeCursus"),
    group: "edit",
    condition: () => true,
  },
  // ── Actions nécessitant l'encodage terminé ──────────────────────
  {
    value: "status",
    label: t("bulk.publishUnpublish"),
    group: "edit",
    condition: ALL_ENCODED,
    conditionLabel:
      "Impossible : une ou plusieurs vidéos sélectionnées ne sont pas encore encodées. Attendez la fin de l'encodage pour modifier le statut de publication.",
  },
  {
    value: "is_auth_required",
    label: t("bulk.restrictAuth"),
    group: "edit",
    condition: ALL_ENCODED,
    conditionLabel:
      "Impossible : la restriction d'accès ne peut être définie que sur des vidéos entièrement encodées.",
  },
  {
    value: "allow_downloading",
    label: t("bulk.allowDownloading"),
    group: "edit",
    condition: ALL_ENCODED,
    conditionLabel:
      "Impossible : le téléchargement ne peut être configuré que sur des vidéos encodées.",
  },
  {
    value: "disable_comment",
    label: t("bulk.disableComments"),
    group: "edit",
    condition: ALL_ENCODED,
    conditionLabel:
      "Impossible : les paramètres de commentaires ne s'appliquent qu'aux vidéos encodées.",
  },
  // ── Programmation temporelle (toujours disponible) ──────────────
  {
    value: "date_delete",
    label: t("bulk.scheduleDeletion"),
    group: "edit",
    condition: () => true,
  },
  // ── Zone de danger ──────────────────────────────────────────────
  {
    value: "delete",
    label: t("bulk.deleteSelected"),
    group: "danger",
    condition: () => true,
  },
];

const LICENSE_CHOICES = [
  { value: "NC", label: "Copyright / Droits réservés" },
  { value: "CC-BY", label: "CC BY — Attribution" },
  { value: "CC-BY-NC", label: "CC BY-NC — Pas d'usage commercial" },
  { value: "CC-BY-NC-ND", label: "CC BY-NC-ND — Pas de modification, pas d'usage commercial" },
  { value: "CC-BY-NC-SA", label: "CC BY-NC-SA — Partage à l'identique, pas d'usage commercial" },
  { value: "CC-BY-SA", label: "CC BY-SA — Partage à l'identique" },
  { value: "CC-BY-ND", label: "CC BY-ND — Pas de modification" },
  { value: "CC0", label: "Domaine public (CC0)" },
];

const CURSUS_CHOICES = [
  { value: "L1", label: "Licence 1" },
  { value: "L2", label: "Licence 2" },
  { value: "L3", label: "Licence 3" },
  { value: "M1", label: "Master 1" },
  { value: "M2", label: "Master 2" },
  { value: "DOC", label: "Doctorat" },
  { value: "OTHER", label: "Autre" },
];

interface Toast {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

import { useTranslation } from "@/src/hooks/useTranslation";

export default function BulkActionsBar({
  selectedVideos,
  types,
  disciplines,
  tags,
  channels,
  onApplySuccess,
  onClearSelection,
}: BulkActionsBarProps) {
  const { t } = useTranslation();
  const [selectedAction, setSelectedAction] = useState<BulkActionKey>("");
  const [fieldValue, setFieldValue] = useState<any>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [toast, setToast] = useState<Toast>({ open: false, message: "", severity: "success" });

  const { bulkUpdate, bulkDelete, isUpdating, isDeleting } = useBulkActions();
  const isLoading = isUpdating || isDeleting;

  const count = selectedVideos.length;
  const hasSelection = count > 0;

  // Calcul des états d'encodage sur la sélection courante
  const hasEncodingInProgress = useMemo(() => SOME_ENCODING(selectedVideos), [selectedVideos]);

  // Actions disponibles / désactivées pour la sélection courante
  const resolvedActions = useMemo(
    () =>
      getActionsOptions(t).map((opt) => ({
        ...opt,
        enabled: opt.condition(selectedVideos),
      })),
    [selectedVideos, t]
  );

  const showToast = useCallback((message: string, severity: "success" | "error") => {
    setToast({ open: true, message, severity });
  }, []);

  const handleDropdownClick = (event: MouseEvent<HTMLElement>) => {
    if (!hasSelection) return;
    setAnchorEl(event.currentTarget);
    setDropdownOpen((prev) => !prev);
  };

  const handleSelectAction = (actionKey: BulkActionKey) => {
    setSelectedAction(actionKey);
    setFieldValue("");
    setDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isLoading) return;
    setIsModalOpen(false);
    setSelectedAction("");
    setFieldValue("");
  };

  const handleSubmit = async () => {
    if (!hasSelection || !selectedAction) return;

    const videoIds = selectedVideos.map((v) => v.id);

    try {
      if (selectedAction === "delete") {
        await bulkDelete(videoIds);
        showToast(
          `${count} vidéo${count > 1 ? "s supprimées" : " supprimée"} avec succès.`,
          "success"
        );
      } else {
        const fieldsPayload: Record<string, any> = {};

        switch (selectedAction) {
          case "type":
            fieldsPayload["type_id"] = Number(fieldValue);
            break;
          case "channel":
            fieldsPayload["channel"] = fieldValue ? Number(fieldValue) : null;
            break;
          case "description":
            fieldsPayload["description"] = fieldValue;
            break;
          case "status":
            fieldsPayload["status"] = fieldValue;
            break;
          case "is_auth_required":
            fieldsPayload["is_auth_required"] = fieldValue === "true" || fieldValue === true;
            break;
          case "allow_downloading":
            fieldsPayload["allow_downloading"] = fieldValue === "true" || fieldValue === true;
            break;
          case "disable_comment":
            fieldsPayload["disable_comment"] = fieldValue === "true" || fieldValue === true;
            break;
          case "license":
            fieldsPayload["license"] = fieldValue;
            break;
          case "date_evt":
            fieldsPayload["date_of_event"] = fieldValue || null;
            break;
          case "date_delete":
            fieldsPayload["date_to_delete"] = fieldValue || null;
            break;
          case "tags":
            fieldsPayload["tags"] =
              typeof fieldValue === "string"
                ? fieldValue.split(",").map((t) => t.trim()).filter(Boolean)
                : fieldValue;
            break;
          case "discipline":
            fieldsPayload["disciplines"] = [Number(fieldValue)];
            break;
          case "cursus":
            fieldsPayload["cursus"] = fieldValue;
            break;
          default:
            fieldsPayload[selectedAction] = fieldValue;
            break;
        }

        await bulkUpdate({ videoIds, fields: fieldsPayload });
        showToast(
          `${count} vidéo${count > 1 ? "s mises à jour" : " mise à jour"} avec succès.`,
          "success"
        );
      }

      setIsModalOpen(false);
      setSelectedAction("");
      setFieldValue("");
      onClearSelection();
      onApplySuccess();
    } catch (err: any) {
      showToast(
        err?.message ?? "Une erreur est survenue lors de l'exécution de l'action groupée.",
        "error"
      );
    }
  };

  const getActionLabel = (key: BulkActionKey) =>
    getActionsOptions(t).find((opt: ActionOption) => opt.value === key)?.label ?? key;

  // La confirmation est désactivée si le champ requis est vide
  // Sauf pour les actions ne nécessitant pas de valeur (delete, channel)
  const NO_VALUE_NEEDED: BulkActionKey[] = ["delete", "channel"];
  const isConfirmDisabled =
    isLoading || (!NO_VALUE_NEEDED.includes(selectedAction) && fieldValue === "");

  return (
    <>
      {/* ── Barre d'actions contextuelle (affichée uniquement lors d'une sélection) ── */}
      {hasSelection && (
        <div
          style={{
            backgroundColor: "var(--c--theme--colors--card-bg, rgba(255, 255, 255, 0.05))",
            border: "1px solid var(--border-color, rgba(0, 0, 0, 0.12))",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {/* Titre + badge sélection */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                {t("bulk.title")}
              </h2>
              {hasSelection ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      backgroundColor:
                        "var(--c--contextuals--background--semantic--brand--primary)",
                      color: "#fff",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      borderRadius: "12px",
                      padding: "2px 10px",
                    }}
                  >
                    {count} {t("common.videos")}
                  </span>
                  {/* Avertissement encodage en cours */}
                  {hasEncodingInProgress && (
                    <Tooltip
                      title="Certaines vidéos sont en cours d'encodage. Les actions nécessitant l'encodage complet sont désactivées."
                      placement="top"
                      arrow
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "#e67e22",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "help",
                        }}
                      >
                        <WarningAmberIcon fontSize="small" />
                        Encodage en cours
                      </span>
                    </Tooltip>
                  )}
                </div>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--c--globals--colors--gray-500)",
                    fontSize: "0.85rem",
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                  {t("bulk.checkVideosPrompt")}
                </span>
              )}
            </div>

            {/* Contrôles */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <Box className={filterStyles.filterItem}>
                <ListItemButton
                  onClick={handleDropdownClick}
                  className={filterStyles.filterButton}
                  aria-expanded={dropdownOpen}
                  disabled={!hasSelection}
                  style={{
                    minWidth: "270px",
                    justifyContent: "space-between",
                    opacity: hasSelection ? 1 : 0.5,
                  }}
                >
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {t("bulk.chooseAction")}
                  </Typography>
                  {dropdownOpen ? (
                    <ExpandLessIcon fontSize="small" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" />
                  )}
                </ListItemButton>

                <Popper
                  open={dropdownOpen}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                  transition
                  sx={{ zIndex: 1300, minWidth: 320, width: Math.max(anchorEl?.clientWidth || 0, 320) }}
                  modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper elevation={8} className={filterStyles.filterMenu}>
                        <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                          <Box sx={{ p: 0.5 }}>
                            {/* Groupe édition */}
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                color: "text.secondary",
                                px: 1.5,
                                pt: 1,
                                pb: 0.8,
                                display: "block",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {t("bulk.editGroup")}
                            </Typography>

                            {resolvedActions
                              .filter((o) => o.group === "edit")
                              .map((opt) => (
                                <Tooltip
                                  key={opt.value}
                                  title={!opt.enabled ? (opt.conditionLabel ?? "Non disponible pour cette sélection") : ""}
                                  placement="right"
                                  arrow
                                  disableHoverListener={opt.enabled}
                                >
                                  {/* span requis pour le Tooltip quand MenuItem est disabled */}
                                  <span style={{ display: "block" }}>
                                    <MenuItem
                                      disabled={!opt.enabled}
                                      onClick={() =>
                                        opt.enabled && handleSelectAction(opt.value)
                                      }
                                      sx={{
                                        borderRadius: "6px",
                                        py: 0.9,
                                        px: 1.5,
                                        fontSize: "0.875rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.2,
                                        whiteSpace: "nowrap",
                                        color: opt.enabled ? "var(--text-color, #0f172a)" : "#64748b",
                                        "&.Mui-disabled": {
                                          opacity: 0.75,
                                          color: "#64748b !important",
                                        },
                                      }}
                                    >
                                      {!opt.enabled && (
                                        <LockIcon
                                          sx={{ fontSize: "0.9rem", color: "#64748b !important", opacity: 0.9 }}
                                        />
                                      )}
                                      {opt.label}
                                    </MenuItem>
                                  </span>
                                </Tooltip>
                              ))}

                            <Divider sx={{ my: 1.5, borderColor: "var(--border-color, rgba(0, 0, 0, 0.12))" }} />

                            {/* Groupe danger */}
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                color: "error.main",
                                px: 1.5,
                                pt: 0.5,
                                pb: 0.5,
                                display: "block",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {t("bulk.dangerZone")}
                            </Typography>
                            {resolvedActions
                              .filter((o) => o.group === "danger")
                              .map((opt) => (
                                <MenuItem
                                  key={opt.value}
                                  onClick={() => handleSelectAction(opt.value)}
                                  sx={{
                                    color: "error.main",
                                    borderRadius: "6px",
                                    py: 0.9,
                                    px: 1.5,
                                    fontSize: "0.875rem",
                                    mb: 0.5,
                                    fontWeight: 600,
                                  }}
                                >
                                  {opt.label}
                                </MenuItem>
                              ))}
                          </Box>
                        </ClickAwayListener>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>

              {hasSelection && (
                <Button
                  type="button"
                  variant="tertiary"
                  color="neutral"
                  onClick={onClearSelection}
                >
                  {t("bulk.deselectAll")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedAction === "delete"
            ? "Confirmer la suppression"
            : `Modifier en lot : ${getActionLabel(selectedAction)}`
        }
        size={ModalSize.MEDIUM}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "8px 0" }}>

          {/* Avertissement suppression */}
          {selectedAction === "delete" && (
            <Alert severity="warning" icon={<WarningAmberIcon />}>
              Vous allez supprimer définitivement{" "}
              <strong>{count} vidéo{count > 1 ? "s" : ""}</strong>.
              Cette action est <strong>irréversible</strong>.
              {hasEncodingInProgress && (
                <div style={{ marginTop: "8px" }}>
                  Attention : certaines vidéos sont actuellement en cours d'encodage.
                </div>
              )}
            </Alert>
          )}

          {/* Formulaire dynamique */}
          {selectedAction !== "delete" && selectedAction !== "" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "10px",
                  fontSize: "0.95rem",
                }}
              >
                Nouvelle valeur pour : <em>{getActionLabel(selectedAction)}</em>
              </label>

              {selectedAction === "type" && (
                <select value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} style={selectStyle}>
                  <option value="" disabled>-- Choisir un type --</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              )}

              {selectedAction === "channel" && (
                <select value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} style={selectStyle}>
                  <option value="">-- Aucune chaîne (retirer de toute chaîne) --</option>
                  {channels.map((ch) => (
                    <option key={ch} value={ch}>Chaîne #{ch}</option>
                  ))}
                </select>
              )}

              {selectedAction === "description" && (
                <textarea
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  rows={4}
                  placeholder="Nouvelle description…"
                  style={{ ...selectStyle, fontFamily: "inherit", resize: "vertical" }}
                />
              )}

              {selectedAction === "status" && (
                <select value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} style={selectStyle}>
                  <option value="" disabled>-- Choisir le statut --</option>
                  <option value="PU">Publique — visible par tous</option>
                  <option value="DR">Privée — brouillon, non visible</option>
                  <option value="RE">Restreinte — lien requis</option>
                </select>
              )}

              {selectedAction === "is_auth_required" && (
                <select value={String(fieldValue)} onChange={(e) => setFieldValue(e.target.value)} style={selectStyle}>
                  <option value="" disabled>-- Choisir --</option>
                  <option value="true">Oui — connexion requise pour accéder</option>
                  <option value="false">Non — accessible sans connexion</option>
                </select>
              )}

              {selectedAction === "allow_downloading" && (
                <select value={String(fieldValue)} onChange={(e) => setFieldValue(e.target.value)} style={selectStyle}>
                  <option value="" disabled>-- Choisir --</option>
                  <option value="true">Oui — autoriser le téléchargement</option>
                  <option value="false">Non — désactiver le téléchargement</option>
                </select>
              )}

              {selectedAction === "disable_comment" && (
                <select value={String(fieldValue)} onChange={(e) => setFieldValue(e.target.value)} style={selectStyle}>
                  <option value="" disabled>-- Choisir --</option>
                  <option value="false">Activer les commentaires</option>
                  <option value="true">Désactiver les commentaires</option>
                </select>
              )}

              {selectedAction === "license" && (
                <select value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} style={selectStyle}>
                  <option value="" disabled>-- Choisir une licence --</option>
                  {LICENSE_CHOICES.map((lic) => (
                    <option key={lic.value} value={lic.value}>{lic.label}</option>
                  ))}
                </select>
              )}

              {selectedAction === "date_evt" && (
                <input
                  type="date"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  style={selectStyle}
                />
              )}

              {selectedAction === "date_delete" && (
                <>
                  <Alert severity="info" sx={{ mb: 1.5, fontSize: "0.85rem" }}>
                    La vidéo sera automatiquement supprimée à la date choisie.
                  </Alert>
                  <input
                    type="date"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    style={selectStyle}
                  />
                </>
              )}

              {selectedAction === "tags" && (
                <>
                  <input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder="ex: cours, informatique, python"
                    style={selectStyle}
                  />
                  <p style={{ color: "var(--c--globals--colors--gray-500)", fontSize: "0.8rem", marginTop: "6px" }}>
                    Séparez les mots-clés par des virgules. Ils remplaceront les mots-clés existants.
                  </p>
                </>
              )}

              {selectedAction === "discipline" && (
                <select value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} style={selectStyle}>
                  <option value="" disabled>-- Choisir une discipline --</option>
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              )}

              {selectedAction === "cursus" && (
                <select value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} style={selectStyle}>
                  <option value="" disabled>-- Choisir le niveau --</option>
                  {CURSUS_CHOICES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Liste des vidéos concernées avec badge encodage */}
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "8px" }}>
              Vidéos concernées ({count}) :
            </p>
            <div
              style={{
                maxHeight: "140px",
                overflowY: "auto",
                border: "1px solid var(--c--globals--colors--gray-200)",
                borderRadius: "8px",
                padding: "8px 12px",
                backgroundColor: "var(--c--globals--colors--gray-050)",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              {selectedVideos.map((video) => {
                const isEncoding =
                  video.encoding_status === "PE" || video.encoding_status === "PR";
                return (
                  <div
                    key={video.id}
                    style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "var(--c--contextuals--background--semantic--brand--primary)",
                        minWidth: "32px",
                      }}
                    >
                      #{video.id}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {video.title}
                    </span>
                    {isEncoding && (
                      <Tooltip title="Encodage en cours" placement="left">
                        <span
                          style={{
                            fontSize: "0.7rem",
                            backgroundColor: "#fff3cd",
                            color: "#856404",
                            borderRadius: "6px",
                            padding: "1px 6px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Encodage
                        </span>
                      </Tooltip>
                    )}
                    {video.encoding_status === "ER" && (
                      <Tooltip title="Erreur d'encodage" placement="left">
                        <span
                          style={{
                            fontSize: "0.7rem",
                            backgroundColor: "#f8d7da",
                            color: "#721c24",
                            borderRadius: "6px",
                            padding: "1px 6px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Erreur
                        </span>
                      </Tooltip>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Boutons de la modal */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "4px" }}>
            <Button
              type="button"
              variant="tertiary"
              color="neutral"
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="primary"
              color={selectedAction === "delete" ? "error" : "brand"}
              onClick={handleSubmit}
              disabled={isConfirmDisabled}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CircularProgress size={16} color="inherit" />
                  Traitement en cours…
                </span>
              ) : selectedAction === "delete" ? (
                "Supprimer définitivement"
              ) : (
                "Confirmer la modification"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Toast global ──────────────────────────────────────────── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          icon={
            toast.severity === "success" ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />
          }
          sx={{ minWidth: "320px", borderRadius: "10px" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

/* ── Styles partagés ─────────────────────────────────────── */
const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid var(--c--globals--colors--gray-300)",
  fontSize: "0.9rem",
  backgroundColor: "#fff",
};
