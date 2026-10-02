"use client";
import styles from "./styles.module.css";
import { useAppInfo } from "@/src/hooks/useAppInfo";
import Link from "next/link";

import { useTranslation } from "@/src/hooks/useTranslation";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Footer() {
  const { info } = useAppInfo();
  const { t } = useTranslation();
  const projectName = info?.project ?? "Esup-Pod";
  const version = info?.version ?? "N/A";
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
  const currentUri = `${origin}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return (
    <footer
      className={`${styles.footer} ${styles["sidebar-fixed"]}`}
      id="footer"
    >
      <div className={styles["footer-content"]}>
        <div className={styles["footer-contact-univ"]}>
          <div className={styles["footer-contact-univ-logo"]}>
            <Image
              src="/logoEsup.svg"
              alt={t("a11y.institutionLogo")}
              className={styles["footer-contact-univ-logo-image"]}
              fill
            />
          </div>
          <address>
            <p>
              Consortium Esup
              <br /> La Maison des Universites
              <br /> 103 Bvd St Michel
              <br />
              75005 PARIS - France
            </p>
          </address>
        </div>
        <div className={styles["footer-link"]}>
          <Link href="/pages/legal-notice">{t("footer.legalNotice")}</Link>
          <Link href="/pages/accessibility">
            {t("footer.accessibilityPartially")}
          </Link>
          <Link href="/pages/site-map">{t("footer.siteMap")}</Link>
          <Link href="/pages/use-pod">{t("home.btnUsePod")}</Link>
          <Link href="/pages/how-to">{t("home.btnHowTo")}</Link>
          <Link href="/pages/copyright">{t("home.btnCopyright")}</Link>
        </div>
        <div className={styles["footer-extra-link"]}>
          <div className={styles["footer-extra-link-icons"]}>
            <span className={styles["footer-extra-link-icon"]}>
              <a
                href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(currentUri)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/socialsmedia/facebook_icon.svg"
                  alt={t("a11y.facebookLogo")}
                  fill
                />
              </a>
            </span>
            <span className={styles["footer-extra-link-icon"]}>
              <a
                href={`https://twitter.com/share?url=${encodeURIComponent(currentUri)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/socialsmedia/x_icon.svg"
                  alt={t("a11y.xLogo")}
                  fill
                />
              </a>
            </span>
            <span className={styles["footer-extra-link-icon"]}>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUri)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/socialsmedia/linkedin_icon.svg"
                  alt={t("a11y.linkedinLogo")}
                  fill
                />
              </a>
            </span>
            <span className={styles["footer-extra-link-icon"]}>
              <a
                href={`https://bsky.app/intent/compose?text=${encodeURIComponent(currentUri)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/socialsmedia/bluesky_icon.svg"
                  alt={t("a11y.blueskyLogo")}
                  fill
                />
              </a>
            </span>
            <span className={styles["footer-extra-link-icon"]}>
              <a
                href={`${encodeURIComponent(currentUri)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/socialsmedia/mastodon_icon.svg"
                  alt={t("a11y.mastodonLogo")}
                  fill
                />
              </a>
            </span>
          </div>
          <div className={styles["footer-link-esup"]}>
            <a
              href="https://github.com/EsupPortail/Esup-Pod-front"
              target="_blank"
              rel="noreferrer"
            >
              {t("footer.esupProject")}
            </a>
            <a
              href="https://www.esup-portail.org/"
              target="_blank"
              rel="noreferrer"
            >
              {t("footer.esupPortal")}
            </a>
          </div>
        </div>
      </div>
      <p className={styles["credits-infos"]}>
        {projectName} | {t("footer.videoPlatform")} - Consortium Esup • Version{" "}
        {version}
      </p>
    </footer>
  );
}
