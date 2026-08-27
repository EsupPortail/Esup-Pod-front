"use client";

import { useEffect } from "react";
import { Button } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ErrorBoundary caught an error:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "5rem",
          fontWeight: 800,
          margin: 0,
          color: "var(--c--contextuals--content--semantic--danger--primary, #ef4444)",
          lineHeight: 1,
        }}
      >
        500
      </h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          margin: "0.5rem 0 1.5rem 0",
          color: "var(--c--contextuals--content--semantic--neutral--primary)",
        }}
      >
        Erreur serveur
      </h2>
      <p
        style={{
          margin: "0 0 2rem 0",
          color: "var(--c--contextuals--content--semantic--neutral--secondary)",
          maxWidth: "400px",
        }}
      >
        Un problème est survenu lors du traitement de votre demande.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <BackButton label="Retour en arrière" />
        <Button variant="primary" color="brand" onClick={() => reset()}>
          Réessayer
        </Button>
      </div>
    </div>
  );
}
