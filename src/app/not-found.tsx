"use client";
import Link from "next/link";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import BackButton from "../components/BackButton/BackButton";
import { useTranslation } from "../hooks/useTranslation";

/* This page is displayed when a 404 error occurs */
export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div>
      <BackButton label={t("common.back")} />
      <h1>{t("errors.notFound")} ☹️</h1>
      <Alert type={VariantType.WARNING}>{t("errors.notConfigured")}</Alert>
      <Link href="/">
        <Button variant="primary">{t("common.backToHomepage")}</Button>
      </Link>
    </div>
  );
}
