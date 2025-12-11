"use client";
import Breadcrumb from "../../components/Breadcrumbs/page";
import styles from "./page.module.css";

export default function Video() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Breadcrumb />
        <div className={styles.content}>
          <p>Page des vidéos !</p>
        </div>
      </main>
    </div>
  );
}
