import styles from "./page.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <div className={styles.footer_contact_univ}>
          <div className={styles.footer_contact_univ_logo}>
            <img src="logoEsup.svg" alt="Logo établissement"></img>
          </div>
          <address>
            <p>
              Consortium Esup
              <br /> La Maison des Universités
              <br /> 103 Bvd St Michel
              <br />
              75005 PARIS - France
            </p>
          </address>
        </div>
        <div className={styles.footer_link}>
          <a href="">Mentions légales</a>
          <a href="">Accessibilité : Partiellement conforme</a>
          <a href="">Plan du site</a>
        </div>
        <div className={styles.footer_extra_link}>
          <div className={styles.footer_extra_link_icons}>
            <img src="facebook_icon.png" alt="Facebook" />
            <img src="x_icon.png" alt="X" />
            <img src="linkedin_icon.png" alt="Linkedin" />
          </div>
          <div className={styles.footer_link}>
            <p>
              <a href="">Projet Esup-Pod</a>
            </p>
            <p>
              <a href="">Esup portail</a>
            </p>
          </div>
        </div>
      </div>
      <p className={styles.credits_infos}>
        Esup.Pod | Plateforme vidéo - Consortium Esup • Version 5.0.0 • 1 vidéos
        disponibles (0:03:43)
      </p>
    </footer>
  );
}
