"use client";
import styles from "./styles.module.css";
import { useAppInfo } from "@/src/hooks/useAppInfo";
import Link from "next/link";

export default function Footer() {
  const { info } = useAppInfo();
  const projectName = info?.project ?? "Esup.Pod";
  const version = info?.version ?? "N/A";

  return (
    <footer className={`${styles.footer} ${styles.sidebarFixed}`} id="footer">
      <div className={styles.footer_content}>
        <div className={styles.footer_contact_univ}>
          <div className={styles.footer_contact_univ_logo}>
            <img src="/logoEsup.svg" alt="Logo etablissement"></img>
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
        <div className={styles.footer_link}>
          <Link href="/pages/mentions-legales">Mentions légales</Link>
          <Link href="/pages/accessibilite">Accessibilité : Partiellement conforme</Link>
          <Link href="/pages/plan-du-site">Plan du site</Link>
          <Link href="/pages/utiliser-pod">Utiliser pod</Link>
          <Link href="/pages/comment-faire">Comment faire</Link>
          <Link href="/pages/droits-auteur">Droits d'auteur</Link>
        </div>
        <div className={styles.footer_extra_link}>
          <div className={styles.footer_extra_link_icons}>
            <img src="/facebook_icon.png" alt="Facebook" />
            <img src="/x_icon.png" alt="X" />
            <img src="/linkedin_icon.png" alt="Linkedin" />
          </div>
          <div className={styles.footer_link_esup}>
            <a href="https://github.com/EsupPortail/Esup-Pod-front" target="_blank" rel="noreferrer">Projet Esup-Pod</a>
            <a href="https://www.esup-portail.org/" target="_blank" rel="noreferrer">Esup portail</a>
          </div>
        </div>
      </div>
      <p className={styles.credits_infos}>
        {projectName} | Plateforme vidéo - Consortium Esup • Version {version}
      </p>
    </footer>
  );
}
