import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | Esup-Pod",
  description:
    "Connectez-vous pour accéder à vos vidéos et votre espace personnel sur Esup-Pod.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
