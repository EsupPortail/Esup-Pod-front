"use client";

import React from "react";
import WebTVHeader from "./WebTVHeader";
import LiveBlockComponent from "./LiveBlockComponent";
import CollectionBlockComponent from "./CollectionBlockComponent";
import VideoGridBlockComponent from "./VideoGridBlockComponent";
import { useLayoutBlocks } from "@/src/hooks/useLayoutBlocks";
import styles from "./WebTVLayout.module.css";

import BlockRenderer from "../blocks/BlockRenderer";

export default function WebTVLayout() {
  const { blocks, loading } = useLayoutBlocks();

  // Find live block configuration if explicitly present in backend blocks
  const liveBlock = blocks.find((b) => b.frontend_id.includes("live") || b.frontend_id.includes("direct"));
  const otherBlocks = blocks.filter((b) => b !== liveBlock);

  return (
    <div className={styles.webTvContainer}>
      <WebTVHeader />

      <main className={styles.mainContent}>
        {/* Top Hero Section: Left = Direct (Live list), Right = Video Grid */}
        <section className={styles.heroSection}>
          <div>
            <LiveBlockComponent block={liveBlock} />
          </div>
          <div>
            <VideoGridBlockComponent isHero itemLimit={6} />
          </div>
        </section>

        {/* Dynamic Blocks Section rendered via BlockRenderer */}
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
            Chargement des contenus WebTV...
          </div>
        ) : otherBlocks.length > 0 ? (
          otherBlocks.map((block) => (
            <BlockRenderer key={block.frontend_id} block={block} />
          ))
        ) : (
          /* Default reference sections matching design if no custom backend blocks defined */
          <>
            <VideoGridBlockComponent title="Actualité : Climat" itemLimit={5} />
            <VideoGridBlockComponent title="Série / Émission" itemLimit={5} />
            <CollectionBlockComponent
              block={{
                frontend_id: "default-collections-actu",
                order: 3,
                is_active: true,
                display_title: "Les Collections d'Actualité",
                item_limit: 5,
              }}
            />
            <CollectionBlockComponent
              block={{
                frontend_id: "default-collections-latest",
                order: 4,
                is_active: true,
                display_title: "Les dernières Collections",
                item_limit: 5,
              }}
            />
            <VideoGridBlockComponent title="Les vidéos les plus vues" itemLimit={5} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.webTvFooter}>
        <div className={styles.footerLogo}>
          <span className="material-icons" style={{ fontSize: "1.5rem" }}>
            school
          </span>
          <span>Université de Lille</span>
        </div>
      </footer>
    </div>
  );
}
