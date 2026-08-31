"use client";
import Link from "next/link";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import BackButton from "../components/BackButton/BackButton";

/* Cette page est affichée lors d'une erreur 404 */
export default function NotFound() {
  return (
    <div>
      <BackButton label="Retour" />
      <h1>Page introuvable ☹️</h1>
      <Alert type={VariantType.WARNING}>La page demandée n'existe pas.</Alert>
      <Link href="/">
        <Button variant="primary">Retour a l'accueil</Button>
      </Link>
    </div>
  );
}
