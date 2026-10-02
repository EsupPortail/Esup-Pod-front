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
import type { Video } from "@/src/types";
import { useTranslation } from "@/src/hooks/useTranslation";

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
  const { createDressing } = useDressings();

  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("top_right");
  const [opacity, setOpacity] = useState(100);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleCreate = async () => {
    if (!title.trim()) {
      setError(t("common.titleRequired"));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const created = await createDressing({ title, position, opacity });
      onCreated((created as any).id);
    } catch (e: any) {
      setError(e.message || t("errors.create"));
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
        {t("common.selectionReturn")}
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
            <div
              style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111" }}
            >
              {t("videoDressing.create")}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              {t("common.configBase")}
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
          label={t("videoDressing.title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="small"
          InputProps={{ style: { borderRadius: BORDER_RADIUS } }}
          helperText={t("videoDressing.unique")}
        />

        {/* Position */}
        <FormControl fullWidth size="small">
          <InputLabel>{t("videoEdit.position")}</InputLabel>
          <Select
            value={position}
            label={t("videoEdit.position")}
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
            <span>{t("videoEdit.oppacity")}</span>
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
          {t("videoDressing.addWatermark")}
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
          {t("common.cancel")}
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
          {saving ? t("videoDressing.creation") : t("videoDressing.create")}
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
    video.dressing ?? "",
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [view, setView] = useState<"select" | "create">("select");
  const { t } = useTranslation();

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
      if (!res.ok)
        throw new Error(t("videoDressing.errorUpdate"));
      setMsg({ text: t("videoDressing.successCreate"), ok: true });
      if (onDressingUpdated) onDressingUpdated();
    } catch (err) {
      setMsg({
        text: err instanceof Error ? err.message : t("errors.update"),
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
    return (
      <CreateDressingPanel
        onBack={() => setView("select")}
        onCreated={handleCreated}
      />
    );
  }

  /* ---- Select panel ---- */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
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
            <div
              style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111" }}
            >
              {t("videoDressing.dressing")}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              {t("videoDressing.addWatermark")}, {t("videoDressing.start")} &amp; {t("videoDressing.end")}.
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
            ((e.currentTarget as HTMLButtonElement).style.background =
              PRIMARY_LIGHT)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "white")
          }
        >
          <AddCircleOutlineIcon fontSize="small" />
          {t("videoDressing.create")}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#6b7280",
            padding: "16px 0",
          }}
        >
          <CircularProgress size={20} style={{ color: PRIMARY }} />
          {t("videoDressing.loading")}
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
          <StyleIcon
            style={{ fontSize: 40, color: "#d1d5db", marginBottom: 8 }}
          />
          <p style={{ margin: "0 0 12px", fontWeight: 500 }}>
            {t("videoDressing.noDressing")}
          </p>
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
            {t("videoDressing.create")}
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
              <span style={{ color: "#6b7280", fontStyle: "italic" }}>
                {t("videoDressing.noDressing")}
              </span>
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
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "#111",
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#9ca3af",
                      marginTop: 2,
                    }}
                  >
                    {[
                      d.watermark ? t("videoDressing.watermark") : null,
                      d.opening_credits ? t("videoDressing.start") : null,
                      d.ending_credits ? t("videoDressing.end") : null,
                    ]
                      .filter(Boolean)
                      .join(" • ") || t("videoDressing.noConfig")}
                  </div>
                </div>
                {selectedDressingId === d.id && (
                  <CheckCircleOutlineIcon
                    style={{ color: PRIMARY, flexShrink: 0 }}
                  />
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
          <div
            style={{ fontWeight: 700, color: PRIMARY, fontSize: "0.875rem" }}
          >
            {t("videoDressing.dressing")} : {activeDressing.title}
          </div>
          {activeDressing.watermark && (
            <div>
              {t("videoDressing.watermark")} — Position : {activeDressing.position}, {t("videoDressing.opacity")} :{" "}
              {activeDressing.opacity}%
            </div>
          )}
          {activeDressing.opening_credits && (
            <div>
              {t("videoDressing.start")} : {t("common.video")} #{activeDressing.opening_credits}
            </div>
          )}
          {activeDressing.ending_credits && (
            <div>{t("videoDressing.end")} : {t("common.video")} #{activeDressing.ending_credits}</div>
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
