"use client";

import { useRouter } from "next/navigation";
import { Button } from "@openfun/cunningham-react";
import styles from "./styles.module.css";

type BackButtonProps = {
  label?: string;
  className?: string;
};

export default function BackButton({
  label = "Retour",
  className,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="tertiary"
      size="nano"
      color="neutral"
      type="button"
      fullWidth={false}
      className={styles.back_button}
      icon={<span className="material-icons">arrow_back</span>}
      iconPosition="left"
      aria-label={label}
    >
      {label}
    </Button>
  );
}
