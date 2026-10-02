"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { BlockConfig, Video } from "@/src/types";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import styles from "./VideoGridBlockComponent.module.css";

const cardColors = [
  "#facc15", // Yellow
  "#64748b", // Gray
  "#38bdf8", // Sky blue
  "#fb7185", // Coral red
  "#34d399", // Mint green
  "#a78bfa", // Purple
  "#fb923c", // Orange
];

interface VideoGridBlockProps {
  block?: BlockConfig;
  videos?: Video[];
  isHero?: boolean;
  title?: string;
  itemLimit?: number;
}

import { useTranslation } from "@/src/hooks/useTranslation";
import Image from "next/image";

export default function VideoGridBlockComponent({
  block,
  videos: providedVideos,
  isHero = false,
  title: providedTitle,
  itemLimit: providedLimit,
}: VideoGridBlockProps) {
  const { config } = useAppConfig();
  const { t } = useTranslation();
  const [videos, setVideos] = useState<Video[]>(providedVideos || []);
  const [loading, setLoading] = useState(!providedVideos);

  const displayTitle =
    providedTitle ||
    block?.display_title ||
    block?.subtitle_or_text ||
    t("common.videos");
  const limit = providedLimit || block?.item_limit || (isHero ? 6 : 5);

  useEffect(() => {
    if (providedVideos) {
      return;
    }

    const fetchVideos = async () => {
      try {
        setLoading(true);
        let endpoint = `${getRoutes().video.list}?limit=${limit}`;

        // Ordering or filtering derived from block extra_config
        if (block?.extra_config?.order_by) {
          endpoint += `&ordering=${block.extra_config.order_by}`;
        }

        const response = await requestJson<Video[] | { results: Video[] }>(
          endpoint,
        );

        const list = Array.isArray(response)
          ? response
          : response?.results || [];

        setVideos(list.slice(0, limit));
      } catch (err) {
        console.error("Error fetching video block:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [block, providedVideos, limit]);

  const showViews = config?.video?.show_views !== false;
  const displayedVideos = providedVideos
    ? providedVideos.slice(0, limit)
    : videos;
  const isLoading = providedVideos ? false : loading;

  return (
    <section className={styles["block-wrapper"]}>
      {!isHero && (
        <div className={styles["section-badge-header"]}>{displayTitle}</div>
      )}

      {isLoading ? (
        <div style={{ padding: "1rem", color: "#666" }}>
          {t("common.loading")}
        </div>
      ) : displayedVideos.length > 0 ? (
        <div className={isHero ? styles.heroGrid : styles["videos-grid"]}>
          {displayedVideos.map((video, index) => {
            const fallbackColor = cardColors[index % cardColors.length];
            return (
              <Link
                key={video.id}
                href={`/video/${video.slug}`}
                className={styles["video-card"]}
              >
                <div className={styles["thumbnail-container"]}>
                  {video.thumbnail ? (
                    <Image
                      unoptimized
                      width={100}
                      height={100}
                      src={video.thumbnail}
                      alt={t("a11y.videoThumbnail", { title: video.title })}
                      className={styles["thumbnail-image"]}
                    />
                  ) : (
                    <div
                      className={styles["thumbnail-placeholder"]}
                      style={{ backgroundColor: fallbackColor }}
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: "2.5rem", opacity: 0.8 }}
                      >
                        play_circle_outline
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles["card-body"]}>
                  <h4 className={styles["card-title"]}>{video.title}</h4>
                  {showViews && video.views_count != null && (
                    <span className={styles["card-meta"]}>
                      <span
                        className="material-icons"
                        style={{ fontSize: "0.9rem" }}
                      >
                        visibility
                      </span>
                      {video.views_count}{" "}
                      {video.views_count > 1
                        ? t("common.views")
                        : t("common.view")}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "1rem", color: "#888", fontStyle: "italic" }}>
          {t("webtv.noContent")}
        </div>
      )}
    </section>
  );
}
