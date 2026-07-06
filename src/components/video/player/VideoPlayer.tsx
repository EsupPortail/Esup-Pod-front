"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/src/types";

import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hotkeys";

type Props = {
  video: Video;
  streamUrl: string;
  //Si true, la vidéo se lance automatiquement (playlist/favoris)

  autoPlay?: boolean;
  //Callback appelé quand la vidéo se termine.

  onEnded?: () => void;
};

export default function VideoPlayer({
  video,
  streamUrl,
  autoPlay,
  onEnded,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    setIsReady(false);
    setHasError(false);

    const mediaEl = document.createElement("video");

    mediaEl.className = "video-js vjs-default-skin vjs-fill";
    mediaEl.controls = true;
    mediaEl.playsInline = true;
    mediaEl.setAttribute("aria-label", video.title);

    Object.assign(mediaEl.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
    });

    const poster = video.thumbnail_url ?? video.thumbnail;
    if (poster) {
      mediaEl.poster = poster;
    }

    for (const subtitle of video.subtitles ?? []) {
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
      fluid: false,
      controls: true,
      preload: "auto",

      autoplay: !!autoPlay,
      playbackRates: [0.5, 1, 1.5, 2],
      controlBar: {
        volumePanel: { inline: false },
        fullscreenToggle: true,
        pictureInPictureToggle: true,
      },
    };

    const vjsPlayer = videojs(mediaEl, options, () => {
      vjsPlayer.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
      });
    });

    const isHls =
      streamUrl.includes(".m3u8") ||
      streamUrl.includes("format=m3u8") ||
      streamUrl.includes("playlist.m3u8");

    vjsPlayer.src({
      src: streamUrl,
      type: isHls ? "application/x-mpegURL" : "video/mp4",
    });

    vjsPlayer.one("loadedmetadata", () => {
      setIsReady(true);
    });

    vjsPlayer.on("error", () => {
      setHasError(true);
    });

    if (onEnded) {
      vjsPlayer.on("ended", () => {
        onEnded();
      });
    }

    return () => {
      vjsPlayer.dispose();

      if (containerEl.contains(mediaEl)) {
        containerEl.removeChild(mediaEl);
      }
    };
  }, [
    streamUrl,
    video.title,
    video.thumbnail_url,
    video.thumbnail,
    video.subtitles,
  ]);

  if (hasError) {
    return (
      <div
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
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        minHeight: "240px",
        maxHeight: "70vh",
        overflow: "hidden",
        backgroundColor: "#000",
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
        zIndex: 0,
      }}
    >
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
          Chargement...
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: isReady ? 1 : 0,
        }}
      />
    </div>
  );
}
