"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { BlockConfig, Video } from "@/src/types";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import styles from "./VideoGridBlockComponent.module.css";


interface VideoGridBlockProps {
  block?: BlockConfig;
  videos?: Video[];
  isHero?: boolean;
  title?: string;
  itemLimit?: number;
}

import { useTranslation } from "@/src/hooks/useTranslation";

import VideosList from "@/src/components/video/VideosList";

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

  const rawTitle =
    providedTitle || block?.display_title || block?.subtitle_or_text || "webtv.latestVideos";
  const displayTitle = t(rawTitle, rawTitle);
  const limit = providedLimit || block?.item_limit || (isHero ? 6 : 5);

  useEffect(() => {
    if (providedVideos) {
      setVideos(providedVideos.slice(0, limit));
      setLoading(false);
      return;
    }

    const fetchVideos = async () => {
      try {
        setLoading(true);
        let endpoint = `${getRoutes().video.list}?limit=${limit}`;

        // Ordering or filtering derived from block extra_config
        if (block?.extra_config) {
          const config = block.extra_config;
          if (config.order_by) {
            endpoint += `&ordering=${config.order_by}`;
          }
          if (config.channel_id) {
            endpoint += `&channel=${config.channel_id}`;
          }
          if (config.type_slug) {
            endpoint += `&type__slug=${config.type_slug}`;
          }
          if (config.tag_slugs && Array.isArray(config.tag_slugs)) {
            config.tag_slugs.forEach((t: string) => {
              endpoint += `&tags__slug=${t}`;
            });
          }
        }

        const response = await requestJson<
          Video[] | { results: Video[] }
        >(endpoint);

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

  return (
    <section className={styles.blockWrapper}>
      {!isHero && (
        <h2 style={{ 
          color: "var(--c--contextuals--content--semantic--neutral--primary)",
          borderBottom: "2px solid var(--c--globals--colors--gray-200)",
          paddingBottom: "var(--c--globals--spacings--xs)",
          marginBottom: "var(--c--globals--spacings--md)",
          fontSize: "1.5rem"
        }}>
          {displayTitle}
        </h2>
      )}
      {loading || videos.length > 0 ? (
        <VideosList videosList={videos} loading={loading} />
      ) : (
        <div style={{ padding: "1rem", color: "var(--c--globals--colors--gray-500)", fontStyle: "italic" }}>
          {t("webtv.noContent")}
        </div>
      )}
    </section>
  );
}
