"use client";

import { useEffect } from "react";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";
import { useTranslation } from "../hooks/useTranslation";
import styles from "./page.module.css";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  useEffect(() => {
    // We could log the error to an external service here (Sentry, etc.)
    console.error("ErrorBoundary caught an error:", error);
  }, [error]);

  return (
    <div className={styles["error-div"]}>
      <Alert canClose={false} type={VariantType.ERROR}>
        <strong>{t("common.error")}</strong>
        <br />
        {error.message || t("errors.unableToSection")}
      </Alert>
      <div className={styles["error-button"]}>
        <BackButton label={t("common.back")} />
        <Button variant="primary" color="brand" onClick={() => reset()}>
          {t("videoPlayer.retry")}
        </Button>
      </div>
    </div>
  );
}
