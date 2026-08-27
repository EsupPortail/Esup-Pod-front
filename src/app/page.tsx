"use client";

import React from "react";
import { useMounted } from "../hooks/useMounted";
import { useLayoutBlocks } from "../hooks/useLayoutBlocks";
import BlockRenderer from "../components/blocks/BlockRenderer";
import CenteredLoader from "../components/Loader/CenteredLoader";

export default function Accueil() {
  const mounted = useMounted();
  const { blocks, loading } = useLayoutBlocks();

  if (!mounted || loading) {
    return <CenteredLoader />;
  }

  /**
   * Blocks are loaded from GET /api/layout/blocks/.
   * Default blocks are seeded by the instrumentation hook at server startup.
   * If the API is empty (first run before sync completes), a friendly fallback is shown.
   */
  return (
    <div>
      {blocks.length > 0 ? (
        blocks.map((block) => (
          <BlockRenderer key={block.id ?? block.frontend_id} block={block} />
        ))
      ) : (
        <div style={{ padding: "var(--c--globals--spacings--xl)", textAlign: "center", color: "var(--c--theme--colors--greyscale-500)" }}>
          <p>La page d'accueil n'a pas encore de blocs configurés.</p>
          <p style={{ fontSize: "0.875rem" }}>
            Connectez-vous à l'administration Django et créez des "Block Configurations" pour les afficher ici.
          </p>
        </div>
      )}
    </div>
  );
}
