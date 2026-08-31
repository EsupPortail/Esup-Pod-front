"use client";

import React, { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useSocialNetworks } from "@/src/hooks/useSocialNetworks";
import { authFetch } from "@/src/api/authFetch";
import { useAuth } from "@/src/context/AuthProvider";
import type { Video } from "@/src/types";

type Props = {
  video: Video;
  onNetworksUpdated?: () => void;
};

export default function VideoSocialNetworksForm({ video, onNetworksUpdated }: Props) {
  const { socialNetworks, isLoading } = useSocialNetworks();
  const { accessToken, refresh } = useAuth();

  const [selectedIds, setSelectedIds] = useState<number[]>(
    video.social_networks ?? socialNetworks.map((n) => n.id)
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleToggleNetwork = async (id: number) => {
    const nextIds = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];

    setSelectedIds(nextIds);
    setIsUpdating(true);
    setMsg(null);

    try {
      const res = await authFetch(`/api/videos/${video.id}/`, {
        accessToken,
        onRefresh: refresh,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ social_networks: nextIds }),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la sauvegarde des réseaux sociaux.");
      }
      setMsg("Réseaux sociaux enregistrés.");
      if (onNetworksUpdated) onNetworksUpdated();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erreur de sauvegarde.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <ShareIcon style={{ color: "var(--c--globals--colors--primary-600, #00818a)" }} />
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
          Réseaux sociaux autorisés au partage
        </h3>
      </div>

      <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
        Choisissez les réseaux sociaux que vous rendez disponibles pour le partage de cette vidéo sur la page de visionnage.
      </p>

      {msg && (
        <div style={{ fontSize: "0.85rem", color: msg.includes("enregistrés") ? "#2e7d32" : "#d32f2f" }}>
          {msg}
        </div>
      )}

      {isLoading ? (
        <p style={{ margin: 0, fontSize: "0.85rem" }}>Chargement des réseaux sociaux...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
          {socialNetworks.map((net) => {
            const isChecked = selectedIds.includes(net.id);
            return (
              <FormControlLabel
                key={net.id}
                control={
                  <Checkbox
                    checked={isChecked}
                    disabled={isUpdating}
                    onChange={() => handleToggleNetwork(net.id)}
                    size="small"
                  />
                }
                label={<span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{net.name}</span>}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
