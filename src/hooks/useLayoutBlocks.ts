"use client";

import { useEffect, useState } from "react";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { BlockConfig } from "@/src/types";

export function useLayoutBlocks() {
  const [blocks, setBlocks] = useState<BlockConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        const data = await requestJson<BlockConfig[] | { results: BlockConfig[] }>(
          getRoutes().layout.blocks
        );
        const blockList = Array.isArray(data) ? data : data?.results || [];
        setBlocks(blockList.filter((b) => b.is_active));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erreur lors de la récupération des blocs de mise en page.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  return { blocks, loading, error };
}
