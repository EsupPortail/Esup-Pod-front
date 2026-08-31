"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FlagIcon from "@mui/icons-material/Flag";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { useChapters } from "@/src/hooks/useChapters";
import type { Video } from "@/src/types";

type Props = {
  video: Video;
};

/* ── helpers ────────────────────────────────────────────────── */
const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

const formatTimestamp = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const parseTimestamp = (str: string): number => {
  const parts = str.trim().split(":").map(Number);
  if (parts.some(isNaN)) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
};

/* ── component ──────────────────────────────────────────────── */
export default function VideoChaptersForm({ video }: Props) {
  const { chapters, createChapter, deleteChapter } = useChapters(
    video.slug,
    video.id
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  /* player state */
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration ?? 0);
  const [isDragging, setIsDragging] = useState(false);

  /* form state */
  const [title, setTitle] = useState("");
  const [timestamp, setTimestamp] = useState("00:00");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── video url ─────────────────────────────────────────────── */
  // Prefer the direct file URL (video_url), fallback to thumbnail-based URL
  const videoSrc = video.video_url ?? null;
  const isEncoded = video.encoding_status === "DO" && videoSrc;

  /* ── player controls ────────────────────────────────────────── */
  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
    } else {
      el.pause();
    }
  };

  const seekTo = useCallback((ratio: number) => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const t = ratio * el.duration;
    el.currentTime = t;
    setCurrentTime(t);
  }, []);

  /* progress bar click / drag */
  const getProgressRatio = (e: React.MouseEvent | MouseEvent): number => {
    const bar = progressRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  };

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    seekTo(getProgressRatio(e));
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => seekTo(getProgressRatio(e));
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, seekTo]);

  /* ── capture current time ───────────────────────────────────── */
  const captureCurrentTime = () => {
    const el = videoRef.current;
    const t = el ? el.currentTime : currentTime;
    setTimestamp(formatTimestamp(t));
    // Pause so the user can inspect the frame
    if (el && !el.paused) el.pause();
  };

  /* ── chapter form ───────────────────────────────────────────── */
  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Veuillez saisir un titre.");
      return;
    }
    const seconds = parseTimestamp(timestamp);
    if (duration && seconds > duration) {
      setFormError(
        `Le timestamp dépasse la durée de la vidéo (${formatTimestamp(duration)}).`
      );
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      await createChapter({ video: video.id, title: title.trim(), time_start: seconds });
      setTitle("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erreur lors de l'ajout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteChapter(id);
    } catch (err) {
      console.error(err);
    }
  };

  /* progress % */
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* sorted chapters */
  const sortedChapters = [...chapters].sort((a, b) => a.time_start - b.time_start);

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── PLAYER SECTION ─────────────────────────────────────── */}
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: "1.5px solid var(--c--globals--colors--gray-200, #e0e0e0)",
          background: "#000",
          position: "relative",
        }}
      >
        {isEncoded ? (
          <>
            {/* VIDEO ELEMENT */}
            <video
              ref={videoRef}
              src={videoSrc}
              style={{ width: "100%", display: "block", maxHeight: 320, background: "#000" }}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />

            {/* CHAPTER MARKERS OVERLAY on video progress */}
            <div
              ref={progressRef}
              onMouseDown={handleProgressMouseDown}
              style={{
                position: "relative",
                height: 8,
                background: "rgba(255,255,255,0.25)",
                cursor: "pointer",
              }}
            >
              {/* Filled bar */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  right: `${100 - progressPct}%`,
                  background: "var(--c--globals--colors--primary-600, #00818a)",
                  transition: isDragging ? "none" : "right 0.1s linear",
                }}
              />

              {/* Chapter segment separators */}
              {duration > 0 &&
                sortedChapters.map((ch) => (
                  <div
                    key={ch.id}
                    title={`${formatTimestamp(ch.time_start)} — ${ch.title}`}
                    style={{
                      position: "absolute",
                      top: -2,
                      bottom: -2,
                      left: `${(ch.time_start / duration) * 100}%`,
                      width: 2,
                      background: "#fff",
                      borderRadius: 2,
                      zIndex: 2,
                    }}
                  />
                ))}

              {/* Playhead thumb */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${progressPct}%`,
                  transform: "translate(-50%, -50%)",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "var(--c--globals--colors--primary-600, #00818a)",
                  border: "2px solid white",
                  zIndex: 3,
                  pointerEvents: "none",
                  boxShadow: "0 0 4px rgba(0,0,0,0.5)",
                }}
              />
            </div>

            {/* CONTROLS BAR */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 14px",
                background: "#111",
                color: "#fff",
              }}
            >
              {/* Play / Pause */}
              <button
                type="button"
                onClick={togglePlay}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  padding: 4,
                  borderRadius: 4,
                }}
                title={isPlaying ? "Pause" : "Lecture"}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </button>

              {/* Current time */}
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.85)",
                  minWidth: 90,
                }}
              >
                {formatTimestamp(currentTime)}
                {" / "}
                {formatTimestamp(duration)}
              </span>

              <div style={{ flex: 1 }} />

              {/* CAPTURE BUTTON */}
              <button
                type="button"
                onClick={captureCurrentTime}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  borderRadius: 999,
                  border: "1.5px solid var(--c--globals--colors--primary-400, #4db6bd)",
                  background: "rgba(0,129,138,0.15)",
                  color: "var(--c--globals--colors--primary-300, #7dd4d8)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
                title="Copie le temps actuel dans le champ Temps"
              >
                <FlagIcon fontSize="small" />
                Capturer ce moment
              </button>
            </div>
          </>
        ) : (
          /* NOT ENCODED YET */
          <div
            style={{
              aspectRatio: "16/9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.9rem",
              padding: 24,
              textAlign: "center",
              background: "#1a1a1a",
            }}
          >
            <BookmarksIcon style={{ fontSize: 40, opacity: 0.4 }} />
            <span style={{ fontWeight: 600, opacity: 0.8 }}>
              Vidéo en cours d&apos;encodage
            </span>
            <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
              Le lecteur sera disponible une fois l&apos;encodage terminé.
              Vous pouvez saisir les timestamps manuellement.
            </span>
          </div>
        )}
      </div>

      {/* ── CHAPTER LIST ───────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <BookmarksIcon
            style={{ fontSize: 18, color: "var(--c--globals--colors--primary-600, #00818a)" }}
          />
          <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
            Chapitres ({sortedChapters.length})
          </span>
        </div>

        {sortedChapters.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              color: "var(--c--globals--colors--gray-500)",
              padding: "12px 0",
            }}
          >
            Aucun chapitre. Lisez la vidéo et cliquez sur{" "}
            <strong>Capturer ce moment</strong> pour ajouter une entrée.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 220,
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {sortedChapters.map((ch, i) => (
              <div
                key={ch.id}
                onClick={() => {
                  const el = videoRef.current;
                  if (el) {
                    el.currentTime = ch.time_start;
                    setCurrentTime(ch.time_start);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  background: "var(--c--globals--colors--gray-050, #f9fafb)",
                  border: "1px solid var(--c--globals--colors--gray-200, #e5e7eb)",
                  borderRadius: 8,
                  cursor: isEncoded ? "pointer" : "default",
                  transition: "background 0.15s",
                }}
                title={isEncoded ? "Cliquer pour aller à ce moment" : undefined}
              >
                {/* Index chip */}
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "var(--c--globals--colors--primary-600, #00818a)",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>

                {/* Timestamp */}
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--c--globals--colors--primary-600, #00818a)",
                    padding: "2px 6px",
                    background: "rgba(0,129,138,0.08)",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatTimestamp(ch.time_start)}
                </span>

                {/* Title */}
                <span
                  style={{
                    flex: 1,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "var(--c--globals--colors--gray-900)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ch.title}
                </span>

                {/* Delete */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(ch.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#ef4444",
                    padding: 4,
                    borderRadius: 4,
                    display: "flex",
                    flexShrink: 0,
                    opacity: 0.7,
                    transition: "opacity 0.15s",
                  }}
                  title="Supprimer ce chapitre"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── ADD CHAPTER FORM ────────────────────────────────────── */}
      <div
        style={{
          padding: 16,
          background: "rgba(0,129,138,0.04)",
          border: "1.5px solid var(--c--globals--colors--primary-200, #b2dfdb)",
          borderRadius: 10,
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--c--globals--colors--primary-700, #005f65)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <AddIcon fontSize="small" />
          Ajouter un chapitre
        </p>

        {formError && (
          <p style={{ margin: "0 0 10px", color: "#d32f2f", fontSize: "0.82rem" }}>
            {formError}
          </p>
        )}

        <form
          onSubmit={handleAddChapter}
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr auto",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          {/* Timestamp input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--c--globals--colors--gray-600)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              Temps
            </label>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="00:00"
              pattern="[0-9]{1,2}:[0-5][0-9](:[0-5][0-9])?"
              style={{
                fontFamily: "monospace",
                fontSize: "1rem",
                fontWeight: 700,
                border: "1.5px solid var(--c--globals--colors--gray-300, #ccc)",
                borderRadius: 8,
                padding: "8px 10px",
                outline: "none",
                color: "var(--c--globals--colors--primary-700, #005f65)",
                background: "#fff",
                width: "100%",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00818a")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--c--globals--colors--gray-300, #ccc)")}
            />
          </div>

          {/* Title input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--c--globals--colors--gray-600)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              Titre du chapitre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Introduction, Démo, Conclusion…"
              style={{
                fontSize: "0.95rem",
                border: "1.5px solid var(--c--globals--colors--gray-300, #ccc)",
                borderRadius: 8,
                padding: "8px 12px",
                outline: "none",
                background: "#fff",
                width: "100%",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00818a")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--c--globals--colors--gray-300, #ccc)")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 20px",
              borderRadius: 8,
              border: "none",
              background:
                isSubmitting || !title.trim()
                  ? "var(--c--globals--colors--gray-300, #ccc)"
                  : "var(--c--globals--colors--primary-600, #00818a)",
              color: isSubmitting || !title.trim() ? "#888" : "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: isSubmitting || !title.trim() ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
          >
            <AddIcon fontSize="small" />
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
