import Link from "next/link";
import type { Column } from "@openfun/cunningham-react";
import type { CollectionDisplayRow } from "./types";
import styles from "./styles.module.css";
import PlaylistCardActionMenu from "../PlaylistActionMenu";

interface GetCollectionGridColumnsOptions {
  rows: CollectionDisplayRow[];
}

export function getCollectionGridColumns({
  rows,
}: GetCollectionGridColumnsOptions): Column<CollectionDisplayRow>[] {
  const hasPlaylistRows = rows.some((row) => row.type === "playlist");
  const hasChannelRows = rows.some((row) => row.type === "channel");
  const hasThemeRows = rows.some((row) => row.type === "theme");

  const columns: Column<CollectionDisplayRow>[] = [
    {
      field: "thumbnailUrl",
      headerName: "",
      enableSorting: false,
      renderCell: ({ row }) => (
        <Link href={row.href} className={styles.thumbnailWrapper}>
          <img className={styles.thumbnail} src={row.thumbnailUrl} alt={row.title} />
        </Link>
      ),
    },
    {
      field: "title",
      headerName: "Titre",
      renderCell: ({ row }) => (
        <Link href={row.href} className={styles.tableTitleLink}>
          {row.title}
        </Link>
      ),
    },
    {
      field: "typeLabel",
      headerName: "Type",
      renderCell: ({ row }) => (
        <span className={styles.typeBadge}>
          {row.typeLabel}
        </span>
      ),
    },
    {
      field: "videosCount",
      headerName: "Vidéos",
      renderCell: ({ row }) => (
        <span className={styles.countBadge}>
          {row.videosCount}
        </span>
      ),
    },
  ];

  if (hasChannelRows) {
    columns.push({
      field: "themesCount",
      headerName: "Thèmes",
      renderCell: ({ row }) => (
        <span className={styles.countBadge}>
          {row.themesCount}
        </span>
      ),
    });
  }

  if (hasThemeRows) {
    columns.push({
      field: "subThemesCount",
      headerName: "Sous-thèmes",
      renderCell: ({ row }) => (
        <span className={styles.countBadge}>
          {row.subThemesCount}
        </span>
      ),
    });
  }

  if (hasPlaylistRows) {
    columns.push({
      field: "createdAtValue",
      headerName: "Création",
      renderCell: ({ row }) => (
        <span className={styles.dateText}>
          {row.createdAtLabel}
        </span>
      ),
    });

    columns.push({
      field: "updatedAtValue",
      headerName: "Modifiée le",
      renderCell: ({ row }) => (
        <span className={styles.dateText}>
          {row.updatedAtLabel}
        </span>
      ),
    });
    columns.push({
      field: "Actions",
      headerName: "",
      renderCell: ({ row }) =>
        row.isOwner &&
        row.playlistSlug != undefined && (
          <PlaylistCardActionMenu slug={row.playlistSlug} />
        ),
    });
  }
  return columns;
}
