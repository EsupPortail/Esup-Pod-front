"use client";
import VideosList from "@/src/components/video/VideosList";
import { Button, Alert, VariantType } from "@openfun/cunningham-react";
import { useVideosList } from "../hooks/useVideos";
import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthProvider";
import CenteredLoader from "../components/Loader/CenteredLoader";
import { useMounted } from "../hooks/useMounted";
import styles from "./page.module.css";

export default function Accueil() {
  const router = useRouter();
  const mounted = useMounted();
  const { videos, useVideoError, useVideoLoading } = useVideosList(undefined, "all", { enabled: mounted });
  const { user } = useAuth();

  const latestVisiblePublicVideos = useMemo(() => {
    return [...videos]
      .filter(
        (video) =>
          (!video.is_auth_required || !!user) &&
          video.status !== "DR" &&
          (video.encoding_status === "DO" || !!video.has_video_file),
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10);
  }, [videos, user]);

  if (!mounted || useVideoLoading) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <h1 className={styles.title}>Pod Univ</h1>
      <h2 className={styles.subtitle}>Bienvenue sur votre plateforme POD !</h2>
      
      <div>
        <div className={styles.welcomeBanner}>
          
          {/* Left Text */}
          <div className={styles.welcomeText}>
            <p style={{ lineHeight: 1.6 }}>
              La vidéo est un média de choix quand il s'agit de communiquer, d'enseigner et d'apprendre. Voici quelques usages qui pourraient vous intéresser.
            </p>
          </div>

          {/* Right Box */}
          <div className={styles.welcomeGreenBox}>
            <span className="material-icons" style={{ fontSize: "3rem", opacity: 0.9 }}>help_outline</span>
            <div>
              <Link href="/pages/comment-faire" className={styles.welcomeLinkTitle}>Comment faire ?</Link>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.4 }}>Vous avez envie de mettre en ligne vos propres contenus ? Ce <Link href="/pages/utiliser-pod" className={styles.welcomeLink}>guide de prise en main</Link> rapide vous présentera les fonctionnalités de base de Pod.</p>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className={styles.actionButtons}>
          <Button onClick={() => router.push('/video/add')} icon={<span className="material-icons">add_circle</span>} variant="primary">Ajouter une vidéo</Button>
          <Button onClick={() => router.push('/pages/utiliser-pod')} icon={<span className="material-icons">play_circle</span>} variant="primary">Utiliser pod</Button>
          <Button onClick={() => router.push('/pages/comment-faire')} icon={<span className="material-icons">help_outline</span>} variant="primary">Comment faire</Button>
          <Button onClick={() => router.push('/pages/droits-auteur')} icon={<span className="material-icons">security</span>} variant="primary">Du droit d'auteur</Button>
        </div>




        <div style={{ marginTop: "var(--c--globals--spacings--xxl)" }}>
          <h2
            style={{
              color:
                "var(--c--contextuals--content--semantic--neutral--primary)",
              borderBottom: "2px solid var(--c--globals--colors--gray-200)",
              paddingBottom: "var(--c--globals--spacings--xs)",
              marginBottom: "var(--c--globals--spacings--md)"
            }}
          >
            Dernières vidéos publiées
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
              <Alert type={useVideoError ? VariantType.WARNING : VariantType.INFO}>
                {useVideoError 
                  ? "Le service vidéo est momentanément indisponible." 
                  : "Aucune vidéo publique récente 🥺"}
              </Alert>
            )
          )}
        </div>
      </div>
    </div>
  );
}
