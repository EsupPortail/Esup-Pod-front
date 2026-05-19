import { useState, useCallback } from "react";
import { Tags } from "../types/interface";
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
      const data = await requestJson<Tags[]>(res);
      setTags(data);
      return data;
    } catch (e: unknown) {
      setUseTagsError(e instanceof Error ? e.message : "Erreur de chargement.");
      return [];
    } finally {
      setUseTagsLoading(false);
    }
  }, [accessToken, refresh]);

  return { tags, fetchAll, useTagsLoading, useTagsError };
}
