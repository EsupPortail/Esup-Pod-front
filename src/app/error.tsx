"use client";

import { useEffect } from "react";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // On pourrait logger l'erreur vers un service externe ici (Sentry, etc.)
    console.error("ErrorBoundary caught an error:", error);
  }, [error]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", justifyContent: "center", padding: "2rem", height: "100%" }}>
      <Alert canClose={false} type={VariantType.ERROR}>
        <strong>Une erreur inattendue est survenue.</strong>
        <br />
        {error.message || "Impossible de charger cette section de l'application."}
      </Alert>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <BackButton label="Retour en arrière" />
        <Button variant="primary" color="brand" onClick={() => reset()}>
          Réessayer
        </Button>
      </div>
    </div>
  );
}
