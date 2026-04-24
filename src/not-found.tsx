"use client";
import Link from "next/link";
import { Alert, Button } from "@openfun/cunningham-react";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page introuvable</h1>
      <Alert type="warning">
        La page demandée n'existe pas ou à été déplacée.
      </Alert>
      <Link href="/">
        <Button variant="primary">Retour a l'accueil</Button>
      </Link>
    </div>
  );
}
