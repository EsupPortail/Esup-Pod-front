"use client";

import { useEffect, useState } from "react";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { BlockConfig } from "@/src/types";
import { useTranslation } from "./useTranslation";

/** Loads the active layout blocks. */
export function useLayoutBlocks() {
  const [blocks, setBlocks] = useState<BlockConfig[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /** Fetches active layout blocks from the backend. */
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        const data = await requestJson<
          BlockConfig[] | { results: BlockConfig[] }
        >(getRoutes().layout.blocks);
        const blockList = Array.isArray(data) ? data : data?.results || [];
        setBlocks(blockList.filter((b) => b.is_active));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t("errors.getBlocks"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [t]);

  return { blocks, loading, error };
}
