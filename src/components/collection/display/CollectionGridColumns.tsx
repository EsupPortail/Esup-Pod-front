import Link from "next/link";
import type { Column } from "@openfun/cunningham-react";
import type { CollectionDisplayRow } from "./types";
import styles from "./styles.module.css";
import PlaylistCardActionMenu from "../PlaylistActionMenu";
import Image from "next/image";

interface GetCollectionGridColumnsOptions {
  rows: CollectionDisplayRow[];
  t?: (key: string, params?: Record<string, string | number>) => string;
}

export function getCollectionGridColumns({
  rows,
  t,
}: GetCollectionGridColumnsOptions): Column<CollectionDisplayRow>[] {
  const translate = t ?? ((key: string) => key);
  const hasPlaylistRows = rows.some((row) => row.type === "playlist");
  const hasChannelRows = rows.some((row) => row.type === "channel");
  const hasThemeRows = rows.some((row) => row.type === "theme");

  const columns: Column<CollectionDisplayRow>[] = [
    {
      field: "thumbnailUrl",
      headerName: "",
      enableSorting: false,
      renderCell: ({ row }) => (
        <Link href={row.href} className={styles["thumbnail-wrapper"]}>
          <Image
            unoptimized
            className={styles["thumbnail"]}
            src={row.thumbnailUrl}
            alt={translate("a11y.collectionThumbnail", { title: row.title })}
            width={56}
            height={34}
          />
        </Link>
      ),
    },
    {
      field: "title",
      headerName: `${t!("table.title")}`,
      renderCell: ({ row }) => (
        <Link href={row.href} className={styles["table-title-link"]}>
          {row.title}
        </Link>
      ),
    },
    {
      field: "typeLabel",
      headerName: `${t!("videoPage.type")}`,
      renderCell: ({ row }) => (
        <span className={styles["type-badge"]}>{row.typeLabel}</span>
      ),
    },
    {
      field: "videosCount",
      headerName: `${t!("common.videos")}`,
      renderCell: ({ row }) => (
        <span className={styles["count-badge"]}>{row.videosCount}</span>
      ),
    },
  ];

  if (hasChannelRows) {
    columns.push({
      field: "themesCount",
      headerName: `${t!("common.theme")}`,
      renderCell: ({ row }) => (
        <span className={styles["count-badge"]}>{row.themesCount}</span>
      ),
    });
  }

  if (hasThemeRows) {
    columns.push({
      field: "subThemesCount",
      headerName: `${t!("common.subtopics")}`,
      renderCell: ({ row }) => (
        <span className={styles["count-badge"]}>{row.subThemesCount}</span>
      ),
    });
  }

  if (hasPlaylistRows) {
    columns.push({
      field: "createdAtValue",
      headerName: `${t!("filters.creationDate")}`,
      renderCell: ({ row }) => (
        <span className={styles["date-text"]}>{row.createdAtLabel}</span>
      ),
    });

    columns.push({
      field: "updatedAtValue",
      headerName: `${t!("videoPage.updatedAt")}`,
      renderCell: ({ row }) => (
        <span className={styles["date-text"]}>{row.updatedAtLabel}</span>
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
