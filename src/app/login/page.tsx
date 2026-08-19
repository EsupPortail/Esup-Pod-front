import type { Metadata } from "next";
import LoginClientPage from "./LoginClientPage";

export const metadata: Metadata = {
  title: "Connexion - Esup-Pod",
  description: "Connectez-vous à la plateforme Esup-Pod pour gérer vos vidéos.",
};

export default function Page() {
  return <LoginClientPage />;
}
