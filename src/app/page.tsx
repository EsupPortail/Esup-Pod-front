"use client";
import VideosList from "@/src/components/video/VideosList";
import { Button, Alert, Loader } from "@openfun/cunningham-react";
import { useVideos } from "../hooks/useVideos";
import { useEffect, useMemo } from "react";
import Link from "next/link";

export default function Accueil() {
  const { fetchAll, videos, useVideoError, useVideoLoading } = useVideos();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const latestPublicVideos = useMemo(() => {
    return [...videos]
      .filter((video) => video.status === "PU")
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10);
  }, [videos]);

  return (
    <div>
      <h1>Bienvenue sur votre plateforme POD !</h1>
      <p>
        La vidéo est un média de choix quand il s'agit de communiquer,
        d'enseigner et d'apprendre. Voici quelques usages qui pourraient vous
        intéresser.
      </p>
      {useVideoLoading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
      {latestPublicVideos.length > 0 ? (
        <div>
          <VideosList videosList={latestPublicVideos} />
          <Link href="/video">
            <Button
              icon={<span className="material-icons">play_circle</span>}
              iconPosition="right"
              variant="primary"
              size="medium"
            >
              Afficher toutes les vidéos
            </Button>
          </Link>
        </div>
      ) : (
        !useVideoLoading && <Alert>Aucune vidéo publique récente 🥺 </Alert>
      )}

      {useVideoError && (
        <Alert canClose type="error">
          {useVideoError}
        </Alert>
      )}
    </div>
  );
}
