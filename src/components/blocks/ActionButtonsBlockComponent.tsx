"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@openfun/cunningham-react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAuth } from "@/src/context/AuthProvider";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import type { BlockConfig } from "@/src/types";
import styles from "@/src/app/page.module.css";

interface ActionButtonsBlockProps {
  block?: BlockConfig;
}

export default function ActionButtonsBlockComponent({ block }: ActionButtonsBlockProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { config } = useAppConfig();

  return (
    <section className={styles.actionButtons} style={{ marginBottom: "var(--c--globals--spacings--xl, 2rem)" }}>
      {user && ((config as any)?.video?.allow_authenticated_upload !== false || user?.is_staff) && (
        <Button onClick={() => router.push('/video/add')} icon={<span className="material-icons">add_circle</span>} variant="primary">{t("common.addVideo")}</Button>
      )}
      <Button onClick={() => router.push('/pages/utiliser-pod')} icon={<span className="material-icons">play_circle</span>} variant="primary">{t("home.btnUsePod")}</Button>
      <Button onClick={() => router.push('/pages/comment-faire')} icon={<span className="material-icons">help_outline</span>} variant="primary">{t("home.btnHowTo")}</Button>
      <Button onClick={() => router.push('/pages/droits-auteur')} icon={<span className="material-icons">security</span>} variant="primary">{t("home.btnCopyright")}</Button>
    </section>
  );
}
