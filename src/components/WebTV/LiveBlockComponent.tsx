"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { BlockConfig } from "@/src/types";
import styles from "./LiveBlockComponent.module.css";

interface LiveEvent {
  id: number;
  slug: string;
  title: string;
  start_date: string;
  end_date: string;
  viewers?: number;
  max_viewers?: number;
  is_draft: boolean;
}

interface LiveBlockProps {
  block?: BlockConfig;
}

import { useTranslation } from "@/src/hooks/useTranslation";

export default function LiveBlockComponent({ block }: LiveBlockProps) {
  const [lives, setLives] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLives = async () => {
      try {
        setLoading(true);
        const orderBy = block?.extra_config?.order_by || "start_date";
        const limit = block?.item_limit || 6;
        const endpoint = `${getRoutes().live.events}?is_current=true&ordering=${orderBy}`;

        const response = await requestJson<LiveEvent[] | { results: LiveEvent[] }>(
          endpoint
        );
        let list = Array.isArray(response) ? response : response?.results || [];

        // If no ongoing live events, fetch upcoming ones as fallback
        if (list.length === 0) {
          const fallbackEndpoint = `${getRoutes().live.events}?ordering=${orderBy}`;
          const fallbackResponse = await requestJson<
            LiveEvent[] | { results: LiveEvent[] }
          >(fallbackEndpoint);
          list = Array.isArray(fallbackResponse)
            ? fallbackResponse
            : fallbackResponse?.results || [];
        }

        setLives(list.slice(0, limit));
      } catch (err) {
        console.error("Error loading live streams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLives();
  }, [block]);

  const title = block?.display_title || t("webtv.liveTitle");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
      <div className={styles.liveContainer}>
        <div className={styles.liveHeader}>{title}</div>
        {loading ? (
          <div className={styles.emptyMessage}>{t("common.loading")}</div>
        ) : lives.length > 0 ? (
          <ul className={styles.liveList}>
            {lives.map((live) => (
              <li key={live.id}>
                <Link href={`/live/${live.slug}`} className={styles.liveItem}>
                  <span className={styles.redDot} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {live.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyMessage}>{t("webtv.noLive")}</div>
        )}
      </div>

      <div className={styles.accentBanner} />
    </div>
  );
}
