import { useCallback, useState } from "react";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { Theme } from "@/src/types";
import { type CollectionListParams } from "@/src/hooks/collectionListParams";
import { useQuery } from "@tanstack/react-query";

export function useTheme() {
  const [listParams, setListParams] = useState<CollectionListParams | undefined>(undefined);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ["themes", "list", listParams],
    queryFn: async () => {
      const url = new URL(getRoutes().theme.list);

      if (listParams?.channel != null) {
        url.searchParams.set("channel", String(listParams.channel));
      }
      if (listParams?.search) {
        url.searchParams.set("search", listParams.search);
      }
      if (listParams?.ordering) {
        url.searchParams.set("ordering", listParams.ordering);
      }
      if (listParams?.page) {
        url.searchParams.set("page", String(listParams.page));
      }

      const res = await authFetch(url.toString());
      if (!res.ok) throw new Error("Erreur de récupération des thèmes.");
      const data = await requestJson<Theme[] | { results?: Theme[]; count?: number }>(res);

      const normalizedThemes = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];
      const count = !Array.isArray(data) && typeof data.count === 'number'
        ? data.count
        : normalizedThemes.length;

      return { themes: normalizedThemes, count };
    },
    staleTime: 30000,
    enabled: listParams !== undefined,
  });

  const detailQuery = useQuery({
    queryKey: ["themes", "detail", currentSlug],
    queryFn: async () => {
      if (!currentSlug) return null;
      const res = await authFetch(getRoutes().theme.get(currentSlug));
      if (!res.ok) throw new Error("Erreur de récupération du thème.");
      return requestJson<Theme>(res);
    },
    enabled: !!currentSlug,
    staleTime: 30000,
  });

  const fetchAll = useCallback(async (params?: CollectionListParams) => {
    setListParams(params);
    return listQuery.data?.themes ?? [];
  }, [listQuery.data]);

  const fetchOne = useCallback(async (slug: string) => {
    setCurrentSlug(slug);
    try {
      const res = await authFetch(getRoutes().theme.get(slug));
      const data = await requestJson<Theme>(res);
      return data;
    } catch {
      return null;
    }
  }, []);

  return {
    themes: listQuery.data?.themes ?? [],
    themesCount: listQuery.data?.count ?? 0,
    theme: detailQuery.data ?? null,
    fetchOne,
    fetchAll,
    useThemeLoading:
      (listParams !== undefined && listQuery.isLoading) ||
      (!!currentSlug && detailQuery.isLoading),
    useThemeError:
      (listParams !== undefined ? (listQuery.error?.message ?? null) : null) ||
      (currentSlug ? (detailQuery.error?.message ?? null) : null),
  };
}
