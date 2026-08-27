import Link from "next/link";
import type { Column } from "@openfun/cunningham-react";
import VideoActionMenu from "@/src/components/video/VideoActionMenu";
import type { VideoDisplayRow } from "./types";
import styles from "./styles.module.css";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

/* Définit les colonnes du tableau de vidéos.*/
export function getVideoGridColumns(
  selectable: boolean = false,
  t?: (key: string) => string,
  onSelectAll?: (checked: boolean) => void,
  isAllSelected: boolean = false
): Column<VideoDisplayRow>[] {
  const tr = (key: string, fallback: string) => (t ? t(key) : fallback);

  return [
    ...(selectable
      ? [
          {
            id: "select",
            field: "select",
            headerName: "",
            enableSorting: false,
            renderCell: ({ row }: { row: VideoDisplayRow }) => (
              <input
                type="checkbox"
                checked={!!row.selected}
                onChange={(e) => row.onSelectToggle?.(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
            ),
          },
        ]
      : []),
    {
      field: "thumbnail",
      headerName: "",
      renderCell: ({ row }) => (
        <Link href={row.href} className={styles.thumbnailWrapper}>
          {row.thumbnailUrl && !row.thumbnailUrl.includes("default_thumbnail") ? (
            <img
              className={styles.thumbnail}
              src={row.thumbnailUrl}
              alt={row.title}
            />
          ) : (
            <div className={styles.defaultThumbnailPoster}>
              <span className="material-icons" style={{ fontSize: "18px", color: "#ffffff" }}>
                play_arrow
              </span>
            </div>
          )}
        </Link>
      ),
    },
    {
      field: "title",
      headerName: tr("table.title", "TITRE"),
      renderCell: ({ row }) => (
        <Link href={row.href} className={styles.tableTitleLink}>
          {row.title}
        </Link>
      ),
    },
    {
      field: "durationLabel",
      headerName: tr("table.duration", "DURÉE"),
      renderCell: ({ row }) => (
        <span className={styles.countBadge}>
          {row.durationLabel}
        </span>
      ),
    },
    {
      field: "createdAtValue",
      headerName: tr("table.dateAdded", "DATE D'AJOUT"),
      renderCell: ({ row }) => (
        <span className={styles.dateText}>
          {row.createdAtLabel}
        </span>
      ),
    },

    {
      id: "visibility",
      field: "visibility",
      headerName: tr("table.status", "STATUT"),
      enableSorting: false,
      renderCell: ({ row }) => {
        if (row.isRestricted) return <span className={`${styles.statusBadge} ${styles.statusRestricted}`}>{tr("table.restricted", "Restreint")}</span>;
        if (row.hasPassword) return <span className={`${styles.statusBadge} ${styles.statusPassword}`}>{tr("table.password", "Mot de passe")}</span>;
        return <span className={`${styles.statusBadge} ${styles.statusPublic}`}>{tr("table.public", "Public")}</span>;
      },
    },
    {
      id: "infos",
      field: "infos",
      headerName: "",
      enableSorting: false,
      renderCell: ({ row }) =>
        row.isOwner ? (
          <>
            {!row.hasSource && (
              <Tooltip title={tr("table.noSourceBadge", "Fiche vide (sans source)")}>
                <InsertDriveFileOutlinedIcon sx={{ color: "var(--text-color-muted, #94a3b8)" }} />
              </Tooltip>
            )}
            {row.hasSource && row.statusEncoding == "PE" && (
              <Tooltip title={tr("table.pendingEncoding", "Vidéo en attente d'encodage")}>
                <PauseCircleFilledIcon color="warning" />
              </Tooltip>
            )}
            {row.hasSource && row.statusEncoding == "ER" && (
              <Tooltip title={tr("table.encodingError", "Erreur d'encodage")}>
                <ErrorIcon color="error" />
              </Tooltip>
            )}
            {row.hasSource && row.statusEncoding == "DO" && (
              <Tooltip title={tr("table.encodingCompleted", "Encodage terminé")}>
                <CheckCircleOutlinedIcon color="success" />
              </Tooltip>
            )}
            {row.statusEncoding == "DR" && (
              <Tooltip title={tr("table.privateVideo", "Vidéo privée")}>
                <span className="material-icons">visibility_off</span>
              </Tooltip>
            )}
          </>
        ) : null,
    },
    {
      id: "actions",
      field: "actions",
      headerName: "",
      enableSorting: false,
      renderCell: ({ row }) =>
        row.isOwner ? (
          <>
            <VideoActionMenu video={row.video} />
          </>
        ) : null,
    },
  ];
}
