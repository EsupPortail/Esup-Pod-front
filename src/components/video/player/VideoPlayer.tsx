import React, { useEffect, useRef, useState, useMemo } from "react";
import type { Video, Chapter } from "@/src/types";
import { useMarker } from "@/src/hooks/useMarker";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import { useTranslation } from "@/src/hooks/useTranslation";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hotkeys";

type Props = {
  video: Video;
  streamUrl: string;
  /** Si true, la vidéo se lance automatiquement (playlist/favoris) */
  autoPlay?: boolean;
  /** Callback appelé quand la vidéo commence. */
  onPlay?: () => void;
  /** Callback appelé quand la vidéo se termine. */
  onEnded?: () => void;
};

export default function VideoPlayer({
  video,
  streamUrl,
  autoPlay,
  onPlay,
  onEnded,
}: Props) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>("16 / 9");
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  const { config } = useAppConfig();
  const useMarkerTime = config?.video?.use_marker_time !== false;
  const { markerTime, saveMarker, resetMarker } = useMarker(video.slug);
  const vjsPlayerRef = useRef<any>(null);
  const hasSeekedRef = useRef(false);

  // Stable serialized keys
  const videoId = video.id;
  const videoTitle = video.title;
  const poster = video.thumbnail_url ?? video.thumbnail ?? "";

  const chapters: Chapter[] = useMemo(() => {
    return [...(video.chapters ?? [])].sort((a, b) => a.time_start - b.time_start);
  }, [video.chapters]);

  const subtitlesKey = JSON.stringify(
    (video.subtitles ?? [])
      .filter((s) => s.file?.endsWith(".vtt"))
      .map((s) => ({ file: s.file, lang: s.language, def: s.is_default }))
  );

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    setIsReady(false);
    setHasError(false);

    let vjsPlayer: ReturnType<typeof videojs> | null = null;
    let mpegtsPlayer: any | null = null;
    let isMounted = true;
    let mediaEl: HTMLVideoElement | null = null;

    const initPlayer = async () => {
      let mpegts: any | null = null;
      try {
        mpegts = (await import("mpegts.js")).default;
      } catch (e) {
        console.warn("mpegts.js could not be loaded:", e);
      }

      const isHls =
        streamUrl.includes(".m3u8") ||
        streamUrl.includes("format=m3u8") ||
        streamUrl.includes("playlist.m3u8");

      const isTs = streamUrl.includes(".ts") || streamUrl.includes("format=ts");

      if (!isMounted) return;

      mediaEl = document.createElement("video");
      mediaEl.className = "video-js vjs-default-skin";
      mediaEl.controls = true;
      mediaEl.playsInline = true;
      mediaEl.setAttribute("aria-label", videoTitle);
      mediaEl.setAttribute("crossOrigin", "anonymous");

      if (poster) {
        mediaEl.poster = poster;
      }

      const validSubtitles = (video.subtitles ?? []).filter(
        (s) => s.file?.endsWith(".vtt")
      );
      for (const subtitle of validSubtitles) {
        const trackEl = document.createElement("track");
        trackEl.kind = "subtitles";
        trackEl.src = subtitle.file;
        trackEl.srclang = subtitle.language.toLowerCase();
        trackEl.label = subtitle.language.toUpperCase();
        trackEl.default = subtitle.is_default;
        mediaEl.appendChild(trackEl);
      }

      containerEl.appendChild(mediaEl);

      const options: any = {
        fill: true,
        controls: true,
        preload: "auto",
        autoplay: !!autoPlay,
        poster: poster,
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
          volumePanel: { inline: false },
          fullscreenToggle: true,
          pictureInPictureToggle: true,
        },
      };

      vjsPlayer = videojs(mediaEl, options, () => {
        vjsPlayer?.hotkeys({
          volumeStep: 0.1,
          seekStep: 1,
          enableModifiersForNumbers: false,
        });
      });
      
      vjsPlayerRef.current = vjsPlayer;

      vjsPlayer.one("loadedmetadata", () => {
        if (!isMounted) return;
        setIsReady(true);
        // Calculate natural video aspect ratio dynamically to prevent black bars
        const w = vjsPlayer?.videoWidth() || mediaEl?.videoWidth;
        const h = vjsPlayer?.videoHeight() || mediaEl?.videoHeight;
        if (w && h && w > 0 && h > 0) {
          setAspectRatio(`${w} / ${h}`);
        }
      });

      vjsPlayer.on("error", () => {
        if (isMounted) setHasError(true);
      });

      if (onPlay) {
        let hasPlayed = false;
        vjsPlayer.on("play", () => {
          if (!hasPlayed && isMounted) {
            hasPlayed = true;
            onPlay();
          }
        });
      }

      if (onEnded) {
        vjsPlayer.on("ended", () => {
          if (isMounted) onEnded();
        });
      }

      if (isHls) {
        vjsPlayer.src({ src: streamUrl, type: "application/x-mpegURL" });
      } else if (isTs && mpegts && mpegts.isSupported()) {
        mpegtsPlayer = mpegts.createPlayer({ type: "mse", url: streamUrl });
        mpegtsPlayer.attachMediaElement(mediaEl);
        mpegtsPlayer.load();
        if (autoPlay) mpegtsPlayer.play();
      } else {
        vjsPlayer.src({ src: streamUrl, type: "video/mp4" });
      }
    };

    initPlayer();

    return () => {
      isMounted = false;
      if (mpegtsPlayer) {
        try { mpegtsPlayer.destroy(); } catch { /* ignore */ }
      }
      if (vjsPlayer) {
        vjsPlayer.dispose();
        vjsPlayerRef.current = null;
      } else if (mediaEl && containerEl.contains(mediaEl)) {
        containerEl.removeChild(mediaEl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl, videoId, videoTitle, poster, subtitlesKey, autoPlay]);

  // Handle seeking to marker time once ready
  useEffect(() => {
    if (isReady && useMarkerTime && markerTime > 0 && !hasSeekedRef.current && vjsPlayerRef.current) {
      vjsPlayerRef.current.currentTime(markerTime);
      hasSeekedRef.current = true;
    }
  }, [isReady, markerTime, useMarkerTime]);

  // Handle saving marker time
  useEffect(() => {
    if (!isReady || !useMarkerTime || !vjsPlayerRef.current) return;
    const player = vjsPlayerRef.current;

    const handlePause = () => {
      const time = player.currentTime();
      if (time && time > 5) { // don't save if very start
        saveMarker(Math.floor(time));
      }
    };

    const handleEnded = () => {
      resetMarker();
      hasSeekedRef.current = false;
    };

    player.on("pause", handlePause);
    player.on("ended", handleEnded);

    return () => {
      player.off("pause", handlePause);
      player.off("ended", handleEnded);
    };
  }, [isReady, useMarkerTime, saveMarker, resetMarker]);

  const isEncoding = video.encoding_status === "PR";

  if (hasError || !streamUrl) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          maxHeight: "78vh",
          aspectRatio: aspectRatio,
          margin: "0 auto",
          overflow: "hidden",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.15)",
        }}
      >
        {poster && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px) brightness(0.3)",
              transform: "scale(1.1)",
            }}
          />
        )}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 16px",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(8px)",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#e2e8f0",
            fontSize: "0.85rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <span className="material-icons" style={{ fontSize: "1.1rem", color: "#94a3b8" }}>
            {isEncoding ? "hourglass_empty" : "info"}
          </span>
          <span>
            {isEncoding
              ? t("videoPlayer.encodingInProgress")
              : t("videoPlayer.unableToLoad")}
          </span>
          <button
            onClick={() => {
              setHasError(false);
              setIsReady(false);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#60a5fa",
              fontWeight: 600,
              fontSize: "0.825rem",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              marginLeft: "4px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            <span className="material-icons" style={{ fontSize: "0.95rem" }}>
              refresh
            </span>
            {t("videoPlayer.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "78vh",
        aspectRatio: aspectRatio,
        margin: "0 auto",
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.15)",
        zIndex: 0,
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Chapters Overlay / Segment Markers on progress bar */}
      {isReady && chapters.length > 0 && video.duration && video.duration > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "35px",
            left: "12px",
            right: "12px",
            height: "4px",
            pointerEvents: "none",
            zIndex: 12,
            display: "flex",
          }}
        >
          {chapters.map((ch, idx) => {
            const nextStart = chapters[idx + 1] ? chapters[idx + 1].time_start : video.duration!;
            const segDuration = Math.max(0, nextStart - ch.time_start);
            const pct = (segDuration / video.duration!) * 100;

            return (
              <div
                key={ch.id || idx}
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  borderRight: idx < chapters.length - 1 ? "2px solid #000" : "none",
                  boxSizing: "border-box",
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredChapter(ch.title)}
                onMouseLeave={() => setHoveredChapter(null)}
                title={ch.title}
              />
            );
          })}
        </div>
      )}

      {/* Chapter Hover Title */}
      {hoveredChapter && (
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            fontWeight: 600,
            pointerEvents: "none",
            zIndex: 15,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {hoveredChapter}
        </div>
      )}

      {!isReady && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#171717",
            color: "#fff",
          }}
        >
          <CenteredLoader />
        </div>
      )}
    </div>
  );
}
