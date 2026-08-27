"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/src/hooks/useTranslation";
import { Alert, VariantType } from "@openfun/cunningham-react";
import type { BlockConfig } from "@/src/types";
import styles from "@/src/app/page.module.css"; // Reuse existing styles

interface WelcomeBannerBlockProps {
  block?: BlockConfig;
}

export default function WelcomeBannerBlockComponent({ block }: WelcomeBannerBlockProps) {
  const { t } = useTranslation();

  return (
    <section style={{ marginBottom: "var(--c--globals--spacings--xl, 2rem)" }}>
      <h1 className={styles.title}>Pod Univ</h1>
      <h2 className={styles.subtitle}>{t("home.welcomeSubtitle")}</h2>
      
      <div className={styles.welcomeBanner}>
        {/* Left Text */}
        <div className={styles.welcomeText}>
          <p style={{ lineHeight: 1.6 }}>
            {t("home.welcomeIntro")}
          </p>
        </div>

        {/* Right Box (Using Cunningham Alert for consistency) */}
        <div style={{ flex: "1" }}>
          <Alert type={VariantType.INFO} title={<Link href="/pages/comment-faire" style={{ textDecoration: 'none' }}>{t("home.howToTitle")}</Link>}>
            <p style={{ margin: 0 }}>
              {t("home.howToDescPrefix")}
              <Link href="/pages/utiliser-pod" style={{ margin: "0 4px", fontWeight: "bold" }}>{t("home.quickGuideLink")}</Link>
              {t("home.howToDescSuffix")}
            </p>
          </Alert>
        </div>
      </div>
    </section>
  );
}
