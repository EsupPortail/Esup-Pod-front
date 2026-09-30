"use client";

import React from "react";
import { usePage } from "@/src/hooks/usePage";
import { useParams } from "next/navigation";
import { Alert, VariantType } from "@openfun/cunningham-react";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import styles from "../../page.module.css";
import BackButton from "@/src/components/BackButton/BackButton";
import { useTranslation } from "@/src/hooks/useTranslation";

export default function FlatPage() {
  const { t } = useTranslation();
  const params = useParams();
  const slug = params.slug as string;
  const { data: page, isLoading, error } = usePage(slug);

  if (isLoading) {
    return <CenteredLoader />;
  }

  if (error || !page) {
    return (
      <div className={styles.main}>
        <BackButton label={t("common.back")} />
        <h1 className={styles["error-title"]}>Page introuvable</h1>
        <Alert type={VariantType.ERROR}>
          {error?.message || t("errors  .notConfigured")}
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles["pages-box"]}>
      <BackButton label={t("common.back")} />
      <h1 className={styles["title"]}>{page.title}</h1>
      <div
        className={styles["content-box"]}
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
