import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | Esup POD",
  description: "Connectez-vous pour accéder à vos vidéos et votre espace personnel sur Esup POD.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
