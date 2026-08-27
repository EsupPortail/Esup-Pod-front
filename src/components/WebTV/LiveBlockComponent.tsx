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

import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
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

  const rawTitle = block?.display_title || "webtv.liveTitle";
  const title = t(rawTitle, rawTitle);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <h2 style={{ 
        color: "var(--c--contextuals--content--semantic--neutral--primary)",
        borderBottom: "2px solid var(--c--globals--colors--gray-200)",
        paddingBottom: "var(--c--globals--spacings--xs)",
        marginBottom: "var(--c--globals--spacings--md)",
        fontSize: "1.5rem"
      }}>
        {title}
      </h2>

      <Card 
        elevation={0}
        sx={{
          backgroundColor: "var(--c--globals--colors--gray-000)",
          border: "1px solid var(--c--globals--colors--gray-200)",
          borderRadius: "12px",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {loading ? (
          <div style={{ padding: "1rem", color: "var(--c--globals--colors--gray-600)" }}>
            {t("common.loading")}
          </div>
        ) : lives.length > 0 ? (
          <List disablePadding>
            {lives.map((live, index) => (
              <ListItem 
                key={live.id} 
                disablePadding 
                divider={index < lives.length - 1}
              >
                <ListItemButton 
                  component={Link} 
                  href={`/live/${live.slug}`}
                  sx={{ padding: "12px 16px", display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <span style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "var(--c--contextuals--background--semantic--danger--primary, #ef4444)",
                    borderRadius: "50%",
                    display: "inline-block",
                    flexShrink: 0,
                  }} />
                  <Typography 
                    sx={{ 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      whiteSpace: "nowrap", 
                      flex: 1,
                      fontWeight: 500,
                      color: "var(--text-color)"
                    }}
                  >
                    {live.title}
                  </Typography>
                  {live.is_draft && (
                    <span style={{ 
                      fontSize: "0.7rem", 
                      background: "var(--c--contextuals--background--semantic--warning--primary, #f59e0b)", 
                      color: "var(--c--contextuals--content--semantic--warning--primary, #fff)", 
                      padding: "2px 8px", 
                      borderRadius: "10px", 
                      marginLeft: "auto", 
                      fontWeight: "bold" 
                    }}>
                      {t("common.draft", "Brouillon")}
                    </span>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <div style={{ padding: "1rem", color: "var(--c--globals--colors--gray-500)", fontStyle: "italic" }}>
            {t("webtv.noLive", "Aucun événement en direct.")}
          </div>
        )}
      </Card>
    </div>
  );
}
