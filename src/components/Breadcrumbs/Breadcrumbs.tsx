"use client";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import styles from "./styles.module.css";
import { usePathname } from "next/navigation";
import { breadcrumbLabels } from "./labelsPages";

export default function Breadcrumb() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  const isVideoEditRoute =
    pathNames.length >= 3 &&
    pathNames[0] === "video" &&
    pathNames[1] === "edit";
  const videoId = isVideoEditRoute ? pathNames[2] : "";
  const isPlaylistEditRoute =
    pathNames.length >= 3 &&
    pathNames[0] === "playlist" &&
    pathNames[1] === "edit";
  const playlistSlug = isPlaylistEditRoute ? pathNames[2] : "";

  return (
    <>
      <Breadcrumbs className={styles.breadcrumb} aria-label="breadcrumb">
        <Link underline="hover" className={styles.breadcrumbLink} href="/">
          Accueil
        </Link>
        {pathNames.length > 0}
        {pathNames.map((link, index) => {
          if ((isVideoEditRoute || isPlaylistEditRoute) && index === 2) {
            return null;
          }
          let href = `/${pathNames.slice(0, index + 1).join("/")}`;
          link = breadcrumbLabels[href] ?? link;
          if (isVideoEditRoute && index === 1) {
            href = `/video/edit/${videoId}`;
            link = `${link} ${videoId}`;
          }
          if (isPlaylistEditRoute && index === 1) {
            href = `/playlist/edit/${playlistSlug}`;
            link = `${link} ${playlistSlug}`;
          }

          return (
            <Link
              key={href}
              underline="hover"
              className={styles.breadcrumbLink}
              href={href}
              aria-current="page"
            >
              {link}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
}
