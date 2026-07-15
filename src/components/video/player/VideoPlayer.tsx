"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Video } from "@/src/types";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";


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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Stable serialized keys to avoid unnecessary re-runs caused by object/array identity changes
  const videoId = video.id;
  const videoTitle = video.title;
  const poster = video.thumbnail_url ?? video.thumbnail ?? "";
  // Stable key: serialize only the subset of subtitle data we actually use
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mpegtsPlayer: any | null = null;
    let isMounted = true;
    let mediaEl: HTMLVideoElement | null = null;

    const initPlayer = async () => {
      // ── 1. Detect stream type BEFORE touching the DOM ──────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // ── 2. Bail out if the component was unmounted during async work ────
      if (!isMounted) return;

      // ── 3. Build the <video> element and add it to the DOM ────────────
      mediaEl = document.createElement("video");
      mediaEl.className = "video-js vjs-default-skin";
      mediaEl.controls = true;
      mediaEl.playsInline = true;
      mediaEl.setAttribute("aria-label", videoTitle);
      mediaEl.setAttribute("crossOrigin", "anonymous");
      mediaEl.tabIndex = -1; // Let video.js handle keyboard navigation, but prevent focus hole

      if (poster) {
        mediaEl.poster = poster;
      }

      // Only add valid .vtt subtitle tracks
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

      // ── 4. Init Video.js ───────────────────────────────────────────────
      const options: any = {
        fluid: true,
        aspectRatio: "16:9",
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
          seekStep: 5,
          enableModifiersForNumbers: false,
        });
      });

      vjsPlayer.one("loadedmetadata", () => {
        if (isMounted) setIsReady(true);
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

      // ── 5. Set the source depending on stream type ─────────────────────
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
      } else if (mediaEl && containerEl.contains(mediaEl)) {
        containerEl.removeChild(mediaEl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl, videoId, videoTitle, poster, subtitlesKey, autoPlay]);

  if (hasError) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        style={{
          display: "flex",
          aspectRatio: "16 / 9",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#171717",
          color: "#fff",
        }}
      >
        Impossible de charger la vidéo.
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          backgroundColor: "#000",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />

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
    </>
  );
}
