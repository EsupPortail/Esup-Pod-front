"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { BlockConfig, Channel } from "@/src/types";
import styles from "./CollectionBlockComponent.module.css";



interface CollectionBlockProps {
  block: BlockConfig;
}

import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import CollectionsList from "@/src/components/collection/CollectionList";

export default function CollectionBlockComponent({ block }: CollectionBlockProps) {
  const [items, setItems] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { config } = useAppConfig();

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

        setItems(filtered.slice(0, limit));
      } catch (err) {
        console.error("Error loading collection block:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [block]);

  const rawTitle = block.display_title || block.subtitle_or_text || "webtv.channelsAndThemes";
  const displayTitle = t(rawTitle, rawTitle);

  return (
    <section className={styles.blockWrapper}>
      <h2 style={{ 
        color: "var(--c--contextuals--content--semantic--neutral--primary)",
        borderBottom: "2px solid var(--c--globals--colors--gray-200)",
        paddingBottom: "var(--c--globals--spacings--xs)",
        marginBottom: "var(--c--globals--spacings--md)",
        fontSize: "1.5rem"
      }}>
        {displayTitle}
      </h2>

      {loading || items.length > 0 ? (
        <CollectionsList channels={items} loading={loading} />
      ) : (
        <div style={{ padding: "1rem", color: "var(--c--globals--colors--gray-500)", fontStyle: "italic" }}>
          {t("webtv.noContent")}
        </div>
      )}
    </section>
  );
}
