"use client";

import { useRouter } from "next/navigation";
import type { Video } from "@/src/types";
import styles from "./styles.module.css";
import Image from "next/image";
import { useTranslation } from "@/src/hooks/useTranslation";

type FavoritesSidebarProps = {
  videos: Video[];
  currentVideoSlug: string;
};

export default function FavoritesSidebar({
  videos,
  currentVideoSlug,
}: FavoritesSidebarProps) {
  const router = useRouter();
  const { t } = useTranslation();

  if (!videos.length) {
    return null;
  }

  const handleClick = (videoSlug: string) => {
    if (videoSlug === currentVideoSlug) {
      return;
    }
    router.push(`/video/${videoSlug}?favorites=1`);
  };

  return (
    <div className={styles["favorites-sidebar"]}>
      <header className={styles["favorites-sidebar-header"]}>
        <div>
          <p className={styles["favorites-sidebar-label"]}>
            {t("sidebar.favorites")}
          </p>
        </div>
      </header>

      <ul className={styles["favorites-sidebar-list"]}>
        {videos.map((video, index) => {
          const isActive = video.slug === currentVideoSlug;

          return (
            <li
              key={video.id ?? video.slug}
              className={`${styles["favorites-sidebar-item"]} ${
                isActive ? styles["favorites-sidebar-item-active"] : ""
              }`}
              onClick={() => handleClick(video.slug)}
            >
              <span className={styles["favorites-sidebar-index"]}>
                {index + 1}
              </span>
              <Image
                unoptimized
                src={video.thumbnail_url || "/default_thumbnail.svg"}
                alt={t("a11y.videoThumbnail", { title: video.title })}
                width={64}
                height={36}
                className={styles["favorites-sidebar-thumbnail"]}
              />
              <div className={styles["favorites-sidebar-text"]}>
                <p className={styles["favorites-sidebar-video-title"]}>
                  {video.title}
                </p>
                {isActive && (
                  <p className={styles["favorites-sidebar-now-playing"]}>
                    {t("sidebar.nowPlaying")}
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
