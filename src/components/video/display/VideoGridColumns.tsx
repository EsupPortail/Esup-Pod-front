import Link from "next/link";
import type { Column } from "@openfun/cunningham-react";
import VideoActionMenu from "@/src/components/video/VideoActionMenu";
import type { VideoDisplayRow } from "./types";
import styles from "./styles.module.css";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DownloadingIcon from "@mui/icons-material/Downloading";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";

/* Définit les colonnes du tableau de vidéos.*/
export function getVideoGridColumns(): Column<VideoDisplayRow>[] {
  return [
    {
      field: "thumbnail",
      headerName: "",
      renderCell: ({ row }) => (
        <Link href={row.href}>
          {" "}
          <img
            className={styles.thumbnail}
            src={row.thumbnailUrl}
            alt="Thumbnail"
          />
        </Link>
      ),
    },
    {
      field: "title",
      headerName: "Titre",
      renderCell: ({ row }) => <Link href={row.href}>{row.title}</Link>,
    },
    {
      field: "durationLabel",
      headerName: "Durée",
    },
    {
      field: "createdAtValue",
      headerName: "Date d'ajout",
      renderCell: ({ row }) => row.createdAtLabel,
    },

    {
      id: "visibility",
      field: "visibility",
      headerName: "Statut",
      enableSorting: false,
      renderCell: ({ row }) => {
        if (row.isRestricted) return "Restreint";
        if (row.hasPassword) return "Mot de passe";
        return "Public";
      },
    },
    {
      id: "actions",
      field: "actions",
      headerName: "",
      enableSorting: false,
      renderCell: ({ row }) =>
        row.isOwner ? (
          <>
            {row.statusEncoding == "PE" && (
              <Tooltip title="Vidéo en attente d'encodage">
                <PauseCircleFilledIcon color="warning" />
              </Tooltip>
            )}
            {row.statusEncoding == "ER" && (
              <Tooltip title="Erreur d'encodage">
                <ErrorIcon color="error" />
              </Tooltip>
            )}
            {row.statusEncoding == "DO" && (
              <Tooltip title="Encodage terminé">
                <CheckCircleOutlinedIcon color="success" />
              </Tooltip>
            )}
            {row.statusEncoding == "DR" && (
              <Tooltip title="Vidéo privée">
                <span className="material-icons">visibility_off</span>
              </Tooltip>
            )}
            <VideoActionMenu video={row.video} />
          </>
        ) : null,
    },
  ];
}
