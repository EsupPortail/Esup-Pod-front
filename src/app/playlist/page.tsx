import type { Metadata } from "next";
import PlaylistClientPage from "./PlaylistClientPage";

export const metadata: Metadata = {
  title: "Listes de lecture - Esup-Pod",
  description: "Découvrez et gérez les listes de lecture publiques de la plateforme Esup-Pod.",
};

export default function Page() {
  return <PlaylistClientPage />;
}
