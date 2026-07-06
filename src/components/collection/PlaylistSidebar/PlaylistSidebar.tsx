"use client";

import { useRouter } from "next/navigation";
import type { Playlist } from "@/src/types";
import styles from "./styles.module.css";
import { truncateVideoTitle } from "@/src/constants/string";

type PlaylistSidebarProps = {
  playlist: Playlist;
  currentVideoSlug: string;
};

export default function PlaylistSidebar({
  playlist,
  currentVideoSlug,
}: PlaylistSidebarProps) {
  const router = useRouter();

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
    <div className={styles.playlistSidebar}>
      <header className={styles.playlistSidebarHeader}>
        <div>
          <p className={styles.playlistSidebarLabel}>
            Lecture de la liste <b> {truncateVideoTitle(playlist.title, 20)}</b>
          </p>
        </div>
      </header>

      <ul className={styles.playlistSidebarList}>
        {items.map((item, index) => {
          const video = item.video!;
          const isActive = video.slug === currentVideoSlug;

          return (
            <li
              key={item.id}
              className={`${styles.playlistSidebarItem} ${
                isActive ? styles.playlistSidebarItemActive : ""
              }`}
              onClick={() => handleClick(video.slug)}
            >
              <span className={styles.playlistSidebarIndex}>{index + 1}</span>
              <img
                src={video.thumbnail_url || "/default_thumbnail.svg"}
                alt={video.title}
                className={styles.playlistSidebarThumbnail}
              />
              <div className={styles.playlistSidebarText}>
                <p className={styles.playlistSidebarVideoTitle}>
                  {truncateVideoTitle(video.title, 20)}
                </p>
                {isActive && (
                  <p className={styles.playlistSidebarNowPlaying}>
                    Lecture en cours
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
