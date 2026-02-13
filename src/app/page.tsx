"use client";
import VideosList from "../components/VideosList/page";
import { Button, Alert } from "@openfun/cunningham-react";
import styles from "./page.module.css";
import { Video } from "../types/interface";
import { useSearchParams } from "next/navigation";

const videos: Video[] = [
  {
    id: 1,
    title: "Exemple vidéo 1",
    time: 85,
    thumbnail: "thumbnail1.png",
    isPrivate: false,
  },
  {
    id: 2,
    title: "Exemple vidéo 2",
    time: 241,
    thumbnail: "thumbnail2.png",
    isPrivate: true,
  },
  {
    id: 3,
    title: "Exemple vidéo 3",
    time: 6000,
    thumbnail: "thumbnail3.png",
    isPrivate: false,
  },
  {
    id: 4,
    title: "Exemple vidéo 4",
    time: 3000,
    thumbnail: "thumbnail4.png",
    isPrivate: false,
  },
];

export default function Accueil() {
  const params = useSearchParams();
  const messageAlert =
    params.get("login") === "success"
      ? "Vous êtes désormais connecté."
      : params.get("logout") === "success"
        ? "Vous êtes désormais déconnecté."
        : null;

  return (
    <div>
      {messageAlert && (
        <Alert canClose type="success">
          {messageAlert}
        </Alert>
      )}

      <h2>
        POD Univ
        <br />
        Bienvenue sur votre plateforme POD !
      </h2>
      <p>
        La vidéo est un média de choix quand il s'agit de communiquer,
        d'enseigner et d'apprendre. Voici quelques usages qui pourraient vous
        intéresser.
      </p>
      <div>
        <VideosList videosList={videos} />
        <div className={styles.content_footer}>
          <Button
            icon={<span className="material-icons">play_circle</span>}
            iconPosition="right"
            variant="primary"
            size="medium"
          >
            Afficher toutes les vidéos
          </Button>
        </div>
      </div>
    </div>
  );
}
