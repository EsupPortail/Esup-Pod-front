"use client";
import VideosList from "@/src/components/video/VideosList";
import { Button, Alert, VariantType } from "@openfun/cunningham-react";
import { useVideos } from "../hooks/useVideos";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthProvider";
import CenteredLoader from "../components/Loader/CenteredLoader";
import { useMounted } from "../hooks/useMounted";
import ShowTags from "../components/Tags/ShowTags";

export default function Accueil() {
  const { fetchAll, videos, useVideoError, useVideoLoading } = useVideos();
  const mounted = useMounted();
  const { user } = useAuth();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const latestVisiblePublicVideos = useMemo(() => {
    return [...videos]
      .filter(
        (video) =>
          (!video.is_auth_required || !!user) &&
          video.status !== "DR" &&
          video.encoding_status === "DO",
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10);
  }, [videos, user]);

  if (!mounted || latestVisiblePublicVideos.length === 0 || useVideoLoading) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <h1>Bienvenue sur votre plateforme POD !</h1>
      <div style={{ marginTop: "var(--c--globals--spacings--md)" }}>
        {useVideoError && (
          <Alert type={VariantType.ERROR} canClose>
            {useVideoError}
          </Alert>
        )}

        {useVideoLoading && <CenteredLoader />}
        <div style={{ marginTop: "var(--c--globals--spacings--l)" }}>
          <h2
            style={{
              color:
                "var(--c--contextuals--content--semantic--neutral--secondary)",
            }}
          >
            Explorez par mots-clés
          </h2>

          <ShowTags videos={videos} />
        </div>
        <div style={{ marginTop: "var(--c--globals--spacings--l)" }}>
          <h2
            style={{
              color:
                "var(--c--contextuals--content--semantic--neutral--secondary)",
            }}
          >
            Dernière vidéos publiées
          </h2>
          {latestVisiblePublicVideos.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--c--globals--spacings--md)",
              }}
            >
              <VideosList videosList={latestVisiblePublicVideos} />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
            </div>
          ) : (
            !useVideoLoading && (
              <Alert type={VariantType.INFO}>
                Aucune vidéo publique récente 🥺{" "}
              </Alert>
            )
          )}
        </div>
      </div>
    </div>
  );
}
