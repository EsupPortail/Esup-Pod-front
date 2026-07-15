import type { Metadata } from "next";
import VideosClientPage from "./VideosClientPage";

export const metadata: Metadata = {
  title: "Toutes les vidéos - Esup-Pod",
  description: "Découvrez toutes les vidéos publiques de la plateforme Esup-Pod.",
};

export default function Page() {
  return <VideosClientPage />;
}
