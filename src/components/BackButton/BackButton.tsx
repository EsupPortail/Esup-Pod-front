"use client";

import { useRouter } from "next/navigation";
import { Button } from "@openfun/cunningham-react";

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
    <Button
      onClick={onClick ?? (() => router.back())}
      variant="tertiary"
      size="nano"
      color="neutral"
      type="button"
      style={{
        color: "var(--c--contextuals--content--semantic--brand--neutral)",
      }}
      className={["back-button", className].filter(Boolean).join(" ")}
      icon={<span className="material-icons">arrow_back</span>}
      iconPosition="left"
      aria-label={label}
    >
      {label}
    </Button>
  );
}
