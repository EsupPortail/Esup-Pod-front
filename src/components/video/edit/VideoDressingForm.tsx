"use client";

import React, { useState } from "react";
import {
  MenuItem,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";
import StyleIcon from "@mui/icons-material/Style";
import PaletteIcon from "@mui/icons-material/Palette";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDressings } from "@/src/hooks/useDressing";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import { requestJson } from "@/src/utils/requestJson";
import type { Video } from "@/src/types";

/* ------------------------------------------------------------------
 * Design tokens – shared across this component
 * ------------------------------------------------------------------ */
const PRIMARY = "#00818a";
const PRIMARY_LIGHT = "rgba(0,129,138,0.08)";
const BORDER_RADIUS = 10; // px – normalised for all elements
const BORDER = "1.5px solid #e5e7eb";

const POSITION_OPTIONS = [
  { value: "top_right", label: "Haut droite" },
  { value: "top_left", label: "Haut gauche" },
  { value: "bottom_right", label: "Bas droite" },
  { value: "bottom_left", label: "Bas gauche" },
];

/* ------------------------------------------------------------------
 * CreateDressingPanel – inline creation panel (replaces the list)
 * ------------------------------------------------------------------ */
type CreatePanelProps = {
  onBack: () => void;
  onCreated: (dressingId: number) => void;
};

function CreateDressingPanel({ onBack, onCreated }: CreatePanelProps) {
  const { accessToken, refresh } = useAuth();
  const { createDressing } = useDressings();

  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("top_right");
  const [opacity, setOpacity] = useState(100);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const created = await createDressing({ title, position, opacity });
      onCreated((created as any).id);
    } catch (e: any) {
      setError(e.message || "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: PRIMARY,
          fontWeight: 600,
          fontSize: "0.9rem",
          padding: 0,
        }}
      >
        <ArrowBackIcon fontSize="small" />
        Retour à la sélection
      </button>

      <div
        style={{
          background: "#f9fafb",
          border: BORDER,
          borderRadius: BORDER_RADIUS,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: PRIMARY_LIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddCircleOutlineIcon style={{ color: PRIMARY, fontSize: 20 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111" }}>
              Nouvel habillage
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Configurez les paramètres de base ci-dessous.
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1.5px solid #fecaca",
              borderRadius: BORDER_RADIUS,
              padding: "10px 14px",
              color: "#b91c1c",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Title */}
        <TextField
          label="Titre de l'habillage *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="small"
          InputProps={{ style: { borderRadius: BORDER_RADIUS } }}
          helperText="Nom unique permettant de retrouver cet habillage facilement."
        />

        {/* Position */}
        <FormControl fullWidth size="small">
          <InputLabel>Position du filigrane</InputLabel>
          <Select
            value={position}
            label="Position du filigrane"
            onChange={(e) => setPosition(e.target.value)}
            style={{ borderRadius: BORDER_RADIUS }}
          >
            {POSITION_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Opacity */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              fontSize: "0.85rem",
              color: "#374151",
              fontWeight: 500,
            }}
          >
            <span>Opacité du filigrane</span>
            <span
              style={{
                background: PRIMARY_LIGHT,
                color: PRIMARY,
                borderRadius: 999,
                padding: "2px 10px",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              {opacity}%
            </span>
          </div>
          <Slider
            value={opacity}
            min={1}
            max={100}
            onChange={(_, v) => setOpacity(v as number)}
            sx={{
              color: PRIMARY,
              "& .MuiSlider-thumb": { borderRadius: "50%" },
            }}
          />
        </div>

        <div
          style={{
            fontSize: "0.8rem",
            color: "#9ca3af",
            borderTop: "1px solid #f3f4f6",
            paddingTop: 12,
          }}
        >
          Pour ajouter un filigrane ou des amorces (vidéo d'ouverture / fermeture), créez
          d'abord l'habillage, puis éditez-le dans les paramètres.
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          style={{
            padding: "8px 20px",
            borderRadius: BORDER_RADIUS,
            border: BORDER,
            background: "white",
            color: "#374151",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: "0.9rem",
            opacity: saving ? 0.5 : 1,
          }}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving || !title.trim()}
          style={{
            padding: "8px 24px",
            borderRadius: BORDER_RADIUS,
            border: "none",
            background: !title.trim() || saving ? "#d1d5db" : PRIMARY,
            color: "white",
            fontWeight: 600,
            cursor: !title.trim() || saving ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "background 0.15s",
          }}
        >
          {saving ? (
            <CircularProgress size={16} style={{ color: "white" }} />
          ) : (
            <CheckCircleOutlineIcon fontSize="small" />
          )}
          {saving ? "Création..." : "Créer l'habillage"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Main component
 * ------------------------------------------------------------------ */
type Props = {
  video: Video;
  onDressingUpdated?: () => void;
};

export default function VideoDressingForm({ video, onDressingUpdated }: Props) {
  const { dressings, isLoading } = useDressings();
  const { accessToken, refresh } = useAuth();

  const [selectedDressingId, setSelectedDressingId] = useState<number | "">(
    video.dressing ?? ""
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [view, setView] = useState<"select" | "create">("select");

  /* ---- Apply dressing to video ---- */
  const handleDressingChange = async (newId: number | "") => {
    setSelectedDressingId(newId);
    setIsUpdating(true);
    setMsg(null);
    try {
      const res = await authFetch(getRoutes().video.update(video.slug), {
        accessToken,
        onRefresh: refresh,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dressing: newId === "" ? null : newId }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour de l'habillage.");
      setMsg({ text: "Habillage appliqué avec succès.", ok: true });
      if (onDressingUpdated) onDressingUpdated();
    } catch (err) {
      setMsg({
        text: err instanceof Error ? err.message : "Erreur de mise à jour.",
        ok: false,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  /* ---- After creation, select the new dressing ---- */
  const handleCreated = async (dressingId: number) => {
    setView("select");
    await handleDressingChange(dressingId);
  };

  const activeDressing = dressings.find((d) => d.id === selectedDressingId);

  /* ---- Create panel ---- */
  if (view === "create") {
    return <CreateDressingPanel onBack={() => setView("select")} onCreated={handleCreated} />;
  }

  /* ---- Select panel ---- */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: PRIMARY_LIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <StyleIcon style={{ color: PRIMARY, fontSize: 20 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111" }}>
              Habillage de la vidéo
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Filigrane, amorce d'ouverture &amp; de fermeture.
            </div>
          </div>
        </div>

        {/* Create button */}
        <button
          type="button"
          onClick={() => setView("create")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 16px",
            borderRadius: BORDER_RADIUS,
            border: `1.5px solid ${PRIMARY}`,
            background: "white",
            color: PRIMARY,
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "background 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = PRIMARY_LIGHT)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "white")
          }
        >
          <AddCircleOutlineIcon fontSize="small" />
          Créer un habillage
        </button>
      </div>

      {/* Feedback message */}
      {msg && (
        <div
          style={{
            background: msg.ok ? "#f0fdf4" : "#fef2f2",
            border: `1.5px solid ${msg.ok ? "#bbf7d0" : "#fecaca"}`,
            borderRadius: BORDER_RADIUS,
            padding: "10px 14px",
            color: msg.ok ? "#15803d" : "#b91c1c",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {msg.ok ? <CheckCircleOutlineIcon fontSize="small" /> : null}
          {msg.text}
        </div>
      )}

      {/* Dressing selector */}
      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#6b7280", padding: "16px 0" }}>
          <CircularProgress size={20} style={{ color: PRIMARY }} />
          Chargement des habillages…
        </div>
      ) : dressings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 16px",
            border: "2px dashed #d1d5db",
            borderRadius: BORDER_RADIUS,
            color: "#9ca3af",
          }}
        >
          <StyleIcon style={{ fontSize: 40, color: "#d1d5db", marginBottom: 8 }} />
          <p style={{ margin: "0 0 12px", fontWeight: 500 }}>Aucun habillage disponible</p>
          <button
            type="button"
            onClick={() => setView("create")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              borderRadius: BORDER_RADIUS,
              border: `1.5px solid ${PRIMARY}`,
              background: PRIMARY,
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            <AddCircleOutlineIcon fontSize="small" />
            Créer mon premier habillage
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* None option */}
          <DressingCard
            isSelected={selectedDressingId === ""}
            onClick={() => handleDressingChange("")}
            disabled={isUpdating}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <DeleteOutlineIcon style={{ color: "#9ca3af" }} />
              <span style={{ color: "#6b7280", fontStyle: "italic" }}>Aucun habillage</span>
            </div>
          </DressingCard>

          {/* Dressing cards */}
          {dressings.map((d) => (
            <DressingCard
              key={d.id}
              isSelected={selectedDressingId === d.id}
              onClick={() => handleDressingChange(d.id)}
              disabled={isUpdating}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: PRIMARY_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <PaletteIcon style={{ color: PRIMARY, fontSize: 16 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111" }}>
                    {d.title}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: 2 }}>
                    {[
                      d.watermark ? "Filigrane" : null,
                      d.opening_credits ? "Amorce début" : null,
                      d.ending_credits ? "Amorce fin" : null,
                    ]
                      .filter(Boolean)
                      .join(" • ") || "Aucun élément configuré"}
                  </div>
                </div>
                {selectedDressingId === d.id && (
                  <CheckCircleOutlineIcon style={{ color: PRIMARY, flexShrink: 0 }} />
                )}
              </div>
            </DressingCard>
          ))}
        </div>
      )}

      {/* Active dressing detail */}
      {activeDressing && (
        <div
          style={{
            padding: "14px 16px",
            background: PRIMARY_LIGHT,
            borderRadius: BORDER_RADIUS,
            border: `1.5px solid ${PRIMARY}30`,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: "0.83rem",
            color: "#374151",
          }}
        >
          <div style={{ fontWeight: 700, color: PRIMARY, fontSize: "0.875rem" }}>
            Habillage actif : {activeDressing.title}
          </div>
          {activeDressing.watermark && (
            <div>Filigrane — Position : {activeDressing.position}, Opacité : {activeDressing.opacity}%</div>
          )}
          {activeDressing.opening_credits && (
            <div>Amorce de début : vidéo #{activeDressing.opening_credits}</div>
          )}
          {activeDressing.ending_credits && (
            <div>Amorce de fin : vidéo #{activeDressing.ending_credits}</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
 * DressingCard – clickable selector row
 * ------------------------------------------------------------------ */
function DressingCard({
  isSelected,
  onClick,
  disabled,
  children,
}: {
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "12px 14px",
        borderRadius: BORDER_RADIUS,
        border: isSelected ? `2px solid ${PRIMARY}` : "1.5px solid #e5e7eb",
        background: isSelected ? PRIMARY_LIGHT : "white",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "border-color 0.15s, background 0.15s",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </button>
  );
}
