"use client";

import { useRouter } from "next/navigation";
import type { Playlist } from "@/src/types";
import styles from "./styles.module.css";
import { truncateVideoTitle } from "@/src/constants/string";
import Image from "next/image";
import { useTranslation } from "@/src/hooks/useTranslation";

type PlaylistSidebarProps = {
  playlist: Playlist;
  currentVideoSlug: string;
};

export default function PlaylistSidebar({
  playlist,
  currentVideoSlug,
}: PlaylistSidebarProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const items = (playlist.items ?? []).filter((item) => !!item.video);

  const handleClick = (videoSlug: string) => {
    if (videoSlug === currentVideoSlug) {
      return;
    }
    router.push(`/video/${videoSlug}?playlist=${playlist.slug}`);
  };

  if (!items.length) {
    return null;
  }

  return (
    <div className={styles["playlist-sidebar"]}>
      <header className={styles["playlist-sidebar-header"]}>
        <div>
          <p className={styles["playlist-sidebar-label"]}>
            {t("playlists.playlists")}
            <b> {truncateVideoTitle(playlist.title, 20)}</b>
          </p>
        </div>
      </header>

      <ul className={styles["playlist-sidebar-list"]}>
        {items.map((item, index) => {
          const video = item.video!;
          const isActive = video.slug === currentVideoSlug;

          return (
            <li
              key={item.id}
              className={`${styles["playlist-sidebar-item"]} ${
                isActive ? styles["playlist-sidebar-item-active"] : ""
              }`}
              onClick={() => handleClick(video.slug)}
            >
              <span className={styles["playlist-sidebar-index"]}>
                {index + 1}
              </span>
              <Image
                unoptimized
                src={video.thumbnail_url || "/default_thumbnail.svg"}
                alt={t("a11y.videoThumbnail", { title: video.title })}
                className={styles["playlist-sidebar-thumbnail"]}
                width={64}
                height={36}
              />
              <div className={styles["playlist-sidebar-text"]}>
                <p className={styles["playlist-sidebar-video-title"]}>
                  {truncateVideoTitle(video.title, 20)}
                </p>
                {isActive && (
                  <p className={styles["playlist-sidebar-now-playing"]}>
                    {t("playlists.nowPlaying")}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
