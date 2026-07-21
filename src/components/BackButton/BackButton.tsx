"use client";

import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

type BackButtonProps = {
  label?: string;
  className?: string;
  onClick?: () => void;
};

export default function BackButton({
  label = "Retour",
  className,
  onClick,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={onClick ?? (() => router.back())}
      type="button"
      className={[styles.backButton, className].filter(Boolean).join(" ")}
      aria-label={label}
    >
      <span className="material-icons">arrow_back</span>
      {label}
    </button>
  );
}
