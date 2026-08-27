"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@openfun/cunningham-react";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { BlockConfig, Video } from "@/src/types";
import VideosList from "@/src/components/video/VideosList";
import { useTranslation } from "@/src/hooks/useTranslation";

interface PresentationVideoBlockProps {
  block?: BlockConfig;
}

export default function PresentationVideoBlockComponent({ block }: PresentationVideoBlockProps) {
  const { t } = useTranslation();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const rawTitle = block?.display_title || block?.subtitle_or_text || "webtv.featured";
  const displayTitle = t(rawTitle, rawTitle);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        // We can fetch a specific video by slug if configured, otherwise fetch the latest featured video
        let endpoint = `${getRoutes().video.list}?limit=1`;
        
        if (block?.extra_config?.video_slug) {
            endpoint = getRoutes().video.detail(block.extra_config.video_slug);
        } else if (block?.extra_config?.channel_id) {
            endpoint += `&channel=${block.extra_config.channel_id}`;
        }

        const response = await requestJson<Video | { results: Video[] }>(endpoint);
        
        if (Array.isArray(response)) {
            setVideo(response[0] || null);
        } else if ('results' in response && Array.isArray(response.results)) {
            setVideo(response.results[0] || null);
        } else {
            setVideo(response as Video);
        }
      } catch (err) {
        console.error("Error fetching presentation video block:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [block]);

  return (
    <section style={{ marginBottom: "var(--c--globals--spacings--xl, 2rem)" }}>
      <h2 style={{ 
        color: "var(--c--contextuals--content--semantic--neutral--primary)",
        borderBottom: "2px solid var(--c--globals--colors--gray-200)",
        paddingBottom: "var(--c--globals--spacings--xs)",
        marginBottom: "var(--c--globals--spacings--md)",
        fontSize: "1.5rem"
      }}>
        {displayTitle}
      </h2>

      {loading ? (
        <VideosList videosList={[]} loading={true} />
      ) : video ? (
        <VideosList videosList={[video]} />
      ) : (
        <div style={{ padding: "1rem", color: "var(--c--globals--colors--gray-500)", fontStyle: "italic" }}>
          {t("webtv.noContent")}
        </div>
      )}
    </section>
  );
}
