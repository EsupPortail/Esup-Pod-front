"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { BlockConfig, Channel } from "@/src/types";
import styles from "./CollectionBlockComponent.module.css";

// Vibrant curated background color list matching the design mockups
const cardColors = [
  "#10b981", // Emerald green
  "#f97316", // Vibrant orange
  "#f472b6", // Soft pink
  "#3b82f6", // Vibrant blue
  "#64748b", // Slate gray
  "#ef4444", // Red
  "#eab308", // Yellow
];

interface CollectionItem {
  id: number | string;
  slug?: string;
  title: string;
  videos_count?: number;
  banner?: string | null;
  logo?: string | null;
  color?: string;
}

interface CollectionBlockProps {
  block: BlockConfig;
}

import { useTranslation } from "@/src/hooks/useTranslation";

export default function CollectionBlockComponent({ block }: CollectionBlockProps) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const collectionType = block.extra_config?.collection_type || "channel";
        const limit = block.item_limit || 5;
        let endpoint = getRoutes().channel.list;

        if (collectionType === "theme") {
          endpoint = getRoutes().theme.list;
        } else if (collectionType === "playlist") {
          endpoint = getRoutes().playlist.list;
        }

        const response = await requestJson<
          Channel[] | { results: Channel[] }
        >(endpoint);

        const list = Array.isArray(response)
          ? response
          : response?.results || [];

        // Apply custom IDs filtering if provided in extra_config
        const customIds = block.extra_config?.collection_ids;
        let filtered = list;
        if (customIds && Array.isArray(customIds) && customIds.length > 0) {
          filtered = customIds
            .map((id) => list.find((c) => c.id === id || c.slug === id))
            .filter(Boolean) as Channel[];
        }

        // Map items with color accents
        const mappedItems: CollectionItem[] = filtered.slice(0, limit).map((c, index) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          videos_count: c.videos_count,
          banner: c.banner || c.logo,
          color: cardColors[index % cardColors.length],
        }));

        setItems(mappedItems);
      } catch (err) {
        console.error("Error loading collection block:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [block]);

  const displayTitle = block.display_title || block.subtitle_or_text || t("common.collections");

  return (
    <section className={styles.blockWrapper}>
      <div className={styles.sectionBadgeHeader}>{displayTitle}</div>

      {loading ? (
        <div style={{ padding: "1rem", color: "#666" }}>{t("common.loading")}</div>
      ) : items.length > 0 ? (
        <div className={styles.cardsGrid}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/channel/${item.slug || item.id}`}
              className={styles.collectionCard}
            >
              <div
                className={styles.cardBanner}
                style={{
                  backgroundColor: item.color,
                  backgroundImage: item.banner ? `url(${item.banner})` : undefined,
                }}
              />
              <div className={styles.cardBody}>
                <h4 className={styles.cardTitle}>{item.title}</h4>
                {item.videos_count !== undefined && (
                  <span className={styles.cardMeta}>
                    {item.videos_count} {item.videos_count > 1 ? t("common.videos") : t("common.video")}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ padding: "1rem", color: "#888", fontStyle: "italic" }}>
          {t("webtv.noContent")}
        </div>
      )}
    </section>
  );
}
