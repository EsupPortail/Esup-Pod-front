import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord | Esup POD",
  description: "Gérez vos vidéos et paramètres sur votre tableau de bord Esup POD.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
