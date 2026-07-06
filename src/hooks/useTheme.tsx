import { useCallback, useState } from "react";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { Theme } from "@/src/types";
import { type CollectionListParams } from "@/src/hooks/collectionListParams";

export function useTheme() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [useThemeLoading, setUseThemeLoading] = useState(false);
  const [useThemeError, setUseThemeError] = useState<string | null>(null);

  const normalizeThemeList = (
    data: Theme[] | { results?: Theme[] },
  ): Theme[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    return [];
  };

  const fetchAll = useCallback(async (params?: CollectionListParams) => {
    setUseThemeLoading(true);
    setUseThemeError(null);

    try {
      const url = new URL(getRoutes().theme.list);

      if (params?.channel != null) {
        url.searchParams.set("channel", String(params.channel));
      }

      if (params?.search) {
        url.searchParams.set("search", params.search);
      }

      if (params?.ordering) {
        url.searchParams.set("ordering", params.ordering);
      }

      if (params?.page) {
        url.searchParams.set("page", String(params.page));
      }

      const res = await authFetch(url.toString());
      const data = await requestJson<Theme[] | { results?: Theme[] }>(res);
      const normalizedThemes = normalizeThemeList(data);

      setThemes(normalizedThemes);
      return normalizedThemes;
    } catch (e: unknown) {
      setUseThemeError(
        e instanceof Error ? e.message : "Erreur de récupération des thèmes.",
      );
      return [];
    } finally {
      setUseThemeLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (slug: string) => {
    setUseThemeLoading(true);
    setUseThemeError(null);

    try {
      const res = await authFetch(getRoutes().theme.get(slug));
      const data = await requestJson<Theme>(res);

      setTheme(data);
      return data;
    } catch (e: unknown) {
      setUseThemeError(
        e instanceof Error ? e.message : "Erreur de récupération du thème.",
      );
      return null;
    } finally {
      setUseThemeLoading(false);
    }
  }, []);

  return {
    themes,
    theme,
    fetchOne,
    fetchAll,
    useThemeLoading,
    useThemeError,
  };
}
