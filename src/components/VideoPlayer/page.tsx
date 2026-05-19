"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/src/types/interface";
import "plyr/dist/plyr.css";

type Props = {
  video: Video;
  streamUrl: string;
};

export default function VideoPlayer({ video, streamUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  console.log(video);

  useEffect(() => {
    if (!videoRef.current) return;

    const mediaElement = videoRef.current;
    let hls: { destroy: () => void } | null = null;
    let player: { destroy: () => void } | null = null;
    let isCancelled = false;

    setIsReady(false);
    setHasError(false);

    const isHlsStream =
      streamUrl.includes(".m3u8") ||
      streamUrl.includes("format=m3u8") ||
      streamUrl.includes("playlist.m3u8");

    const setupVideo = async () => {
      try {
        const [{ default: Plyr }, hlsModule] = await Promise.all([
          import("plyr"),
          isHlsStream ? import("hls.js") : Promise.resolve(null),
        ]);

        if (isCancelled || !mediaElement.isConnected) return;

        player = new Plyr(mediaElement, {
          ratio: "16:9",
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "pip",
            "airplay",
            "fullscreen",
          ],
          captions: {
            active: true,
            update: true,
            language: "auto",
          },
          keyboard: {
            focused: true,
            global: true,
          },
          fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: true,
          },
        });

        const plyrWrapper = mediaElement.closest(".plyr") as HTMLElement | null;
        if (plyrWrapper) {
          plyrWrapper.style.width = "100%";
          plyrWrapper.style.height = "100%";
        }

        if (isHlsStream && hlsModule?.default.isSupported()) {
          const Hls = hlsModule.default;
          hls = new Hls({ enableWorker: true });
          hls.loadSource(streamUrl);
          hls.attachMedia(mediaElement);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!isCancelled) {
              setIsReady(true);
            }
          });

          hls.on(Hls.Events.ERROR, (_, data) => {
            console.error("HLS error:", data);
            if (!isCancelled) {
              setHasError(true);
            }
          });

          return;
        }

        if (
          isHlsStream &&
          mediaElement.canPlayType("application/vnd.apple.mpegurl")
        ) {
          mediaElement.src = streamUrl;
          return;
        }

        mediaElement.src = streamUrl;
        mediaElement.load();
      } catch (error) {
        console.error(error);
        if (!isCancelled) {
          setHasError(true);
        }
      }
    };

    mediaElement.onloadedmetadata = () => {
      if (!isCancelled) {
        setIsReady(true);
      }
    };

    mediaElement.onerror = () => {
      if (!isCancelled) {
        setHasError(true);
      }
    };

    setupVideo();

    return () => {
      isCancelled = true;

      try {
        if (hls) {
          hls.destroy();
          hls = null;
        }

        if (player) {
          player.destroy();
          player = null;
        }
      } catch (error) {
        console.error("Video player cleanup error:", error);
      }

      if (mediaElement) {
        mediaElement.onloadedmetadata = null;
        mediaElement.onerror = null;

        if (mediaElement.isConnected) {
          mediaElement.removeAttribute("src");
          mediaElement.load();
        }
      }
    };
  }, [streamUrl]);

  if (hasError) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-neutral-900 text-white">
        Impossible de charger la video.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-black shadow-xl"
      style={{
        aspectRatio: "16 / 9",
        minHeight: "240px",
        maxHeight: "70vh",
      }}
    >
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-white">
          Chargement...
        </div>
      )}

      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        style={{ opacity: isReady ? 1 : 0 }}
        poster={video.thumbnail_url ?? video.thumbnail ?? undefined}
        playsInline
        controls={false}
        aria-label={video.title}
      >
        {(video.subtitles ?? []).map((subtitle) => (
          <track
            key={subtitle.id}
            kind="subtitles"
            src={subtitle.file}
            srcLang={subtitle.language.toLowerCase()}
            label={subtitle.language.toUpperCase()}
            default={subtitle.is_default}
          />
        ))}
      </video>
    </div>
  );
}
