import Link from "next/link";
import type { Column } from "@openfun/cunningham-react";
import VideoActionMenu from "@/src/components/video/VideoActionMenu";
import type { VideoDisplayRow } from "./types";
import styles from "./styles.module.css";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";

/* Defines the columns of the video table. */
export function getVideoGridColumns(
  selectable: boolean = false,
  t?: (key: string, params?: Record<string, string | number>) => string,
): Column<VideoDisplayRow>[] {
  const tr = (
    key: string,
    fallback: string,
    params?: Record<string, string | number>,
  ) => (t ? t(key, params) : fallback);

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
        <Link href={row.href} className={styles["thumbnail-wrapper"]}>
          {row.thumbnailUrl &&
          !row.thumbnailUrl.includes("default_thumbnail") ? (
            <Image
              width={100}
              height={100}
              unoptimized
              className={styles["thumbnail"]}
              src={row.thumbnailUrl}
              alt={tr("a11y.videoThumbnail", row.title, { title: row.title })}
            />
          ) : (
            <div className={styles["default-thumbnail-poster"]}>
              <span
                className="material-icons"
                style={{ fontSize: "18px", color: "#ffffff" }}
              >
                play_arrow
              </span>
            </div>
          )}
        </Link>
      ),
    },
    {
      field: "title",
      headerName: tr("table.title", "TITLE"),
      renderCell: ({ row }) => (
        <Link href={row.href} className={styles["table-title-link"]}>
          {row.title}
        </Link>
      ),
    },
    {
      field: "durationLabel",
      headerName: tr("table.duration", "DURATION"),
      renderCell: ({ row }) => (
        <span className={styles["count-badge"]}>{row.durationLabel}</span>
      ),
    },
    {
      field: "createdAtValue",
      headerName: tr("table.dateAdded", "ADDED DATE"),
      renderCell: ({ row }) => (
        <span className={styles["date-text"]}>{row.createdAtLabel}</span>
      ),
    },

    {
      id: "visibility",
      field: "visibility",
      headerName: tr("table.status", "STATUT"),
      enableSorting: false,
      renderCell: ({ row }) => {
        if (row.isRestricted)
          return (
            <span
              className={`${styles["status-badge"]} ${styles["status-restricted"]}`}
            >
              {tr("table.restricted", "Restricted")}
            </span>
          );
        if (row.hasPassword)
          return (
            <span
              className={`${styles["status-badge"]} ${styles["status-password"]}`}
            >
              {tr("table.password", "Password")}
            </span>
          );
        return (
          <span
            className={`${styles["status-badge"]} ${styles["status-public"]}`}
          >
            {tr("table.public", "Public")}
          </span>
        );
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
            {row.statusEncoding == "PE" && (
              <Tooltip
                title={tr("table.pendingEncoding", "Video awaiting encoding")}
              >
                <PauseCircleFilledIcon color="warning" />
              </Tooltip>
            )}
            {row.statusEncoding == "ER" && (
              <Tooltip title={tr("table.encodingError", "Encoding error")}>
                <ErrorIcon color="error" />
              </Tooltip>
            )}
            {row.statusEncoding == "DO" && (
              <Tooltip
                title={tr("table.encodingCompleted", "Encoding completed")}
              >
                <CheckCircleOutlinedIcon color="success" />
              </Tooltip>
            )}
            {row.statusEncoding == "DR" && (
              <Tooltip title={tr("table.privateVideo", "Private video")}>
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
