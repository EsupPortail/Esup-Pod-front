import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord | Esup-Pod",
  description:
    "Gérez vos vidéos et paramètres sur votre tableau de bord Esup-Pod.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
