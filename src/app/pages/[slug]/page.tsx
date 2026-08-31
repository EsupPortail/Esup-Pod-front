"use client";

import React from "react";
import { usePage } from "@/src/hooks/usePage";
import { useParams } from "next/navigation";
import { Alert, VariantType } from "@openfun/cunningham-react";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import styles from "../../page.module.css";
import BackButton from "@/src/components/BackButton/BackButton";

export default function FlatPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: page, isLoading, error } = usePage(slug);

  if (isLoading) {
    return <CenteredLoader />;
  }

  if (error || !page) {
    return (
      <div className={styles.main}>
        <BackButton label="Retour" />
        <h1 style={{ marginTop: "1rem" }}>Page introuvable</h1>
        <Alert type={VariantType.ERROR}>
          {error?.message || "La page demandée n'existe pas ou n'a pas encore été configurée pour cette université."}
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles.main} style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <BackButton label="Retour" />
      <h1 style={{ marginTop: "1rem", color: "var(--c--globals--colors--primary-600)" }}>{page.title}</h1>
      <div 
        style={{ marginTop: "2rem", lineHeight: "1.6" }}
        dangerouslySetInnerHTML={{ __html: page.content }} 
      />
    </div>
  );
}
