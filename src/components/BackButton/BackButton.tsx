"use client";

import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

import { useTranslation } from "@/src/hooks/useTranslation";

type BackButtonProps = {
  label?: string;
  className?: string;
  onClick?: () => void;
};

export default function BackButton({
  label,
  className,
  onClick,
}: BackButtonProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const displayLabel = label ?? t("common.back");

  return (
    <button
      onClick={onClick ?? (() => router.back())}
      type="button"
      className={[styles.backButton, className].filter(Boolean).join(" ")}
      aria-label={displayLabel}
    >
      <span className="material-icons">arrow_back</span>
      {displayLabel}
    </button>
  );
}
