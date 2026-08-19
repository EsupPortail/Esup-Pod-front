import type { Metadata } from "next";
import DashboardClientPage from "./DashboardClientPage";

export const metadata: Metadata = {
  title: "Tableau de bord - Esup-Pod",
  description: "Gérez vos vidéos, collections et préférences depuis votre tableau de bord Esup-Pod.",
};

export default function Page() {
  return <DashboardClientPage />;
}
