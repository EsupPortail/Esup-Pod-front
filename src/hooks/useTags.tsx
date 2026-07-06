import { useState, useCallback } from "react";
import type { Tags } from "@/src/types";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { getRoutes } from "../api/routes";
import { requestJson } from "../utils/requestJson";

export function useTags() {
  const { accessToken, refresh } = useAuth();
  const [tags, setTags] = useState<Tags[]>([]);
  const [useTagsLoading, setUseTagsLoading] = useState(false);
  const [useTagsError, setUseTagsError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setUseTagsLoading(true);
    setUseTagsError(null);
    try {
      const res = await authFetch(getRoutes().tags.list, {
        accessToken,
        onRefresh: refresh,
      });
      const data = await requestJson<Tags[] | { results?: Tags[] }>(res);
      const normalizedTags = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      setTags(normalizedTags);
      return normalizedTags;
    } catch (e: unknown) {
      setUseTagsError(e instanceof Error ? e.message : "Erreur de chargement.");
      return [];
    } finally {
      setUseTagsLoading(false);
    }
  }, [accessToken, refresh]);

  return { tags, fetchAll, useTagsLoading, useTagsError };
}
