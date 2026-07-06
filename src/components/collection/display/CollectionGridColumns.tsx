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
        <Link href={row.href}>
          <img className={styles.thumbnail} src={row.thumbnailUrl} alt="" />
        </Link>
      ),
    },
    {
      field: "title",
      headerName: "Titre",
      renderCell: ({ row }) => <Link href={row.href}>{row.title}</Link>,
    },
    {
      field: "typeLabel",
      headerName: "Type",
    },
    {
      field: "videosCount",
      headerName: "Vidéos",
    },
  ];

  if (hasChannelRows) {
    columns.push({
      field: "themesCount",
      headerName: "Thèmes",
      renderCell: ({ row }) => row.themesCount,
    });
  }

  if (hasThemeRows) {
    columns.push({
      field: "subThemesCount",
      headerName: "Sous-thèmes",
      renderCell: ({ row }) => row.subThemesCount,
    });
  }

  if (hasPlaylistRows) {
    columns.push({
      field: "createdAtValue",
      headerName: "Création",
      renderCell: ({ row }) => row.createdAtLabel,
    });

    columns.push({
      field: "updatedAtValue",
      headerName: "Modifiée le",
      renderCell: ({ row }) => row.updatedAtLabel,
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
