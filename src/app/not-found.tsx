"use client";

import Link from "next/link";
import { Button } from "@openfun/cunningham-react";
import BackButton from "../components/BackButton/BackButton";

export default function NotFound() {
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
          color: "var(--c--contextuals--content--semantic--warning--primary, #f59e0b)",
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          margin: "0.5rem 0 1.5rem 0",
          color: "var(--c--contextuals--content--semantic--neutral--primary)",
        }}
      >
        Page introuvable
      </h2>
      <p
        style={{
          margin: "0 0 2rem 0",
          color: "var(--c--contextuals--content--semantic--neutral--secondary)",
          maxWidth: "400px",
        }}
      >
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <BackButton label="Retour" />
        <Link href="/">
          <Button variant="primary">Accueil</Button>
        </Link>
      </div>
    </div>
  );
}
