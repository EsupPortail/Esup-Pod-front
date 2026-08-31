import { useState, useCallback } from "react";
import type { Channel } from "@/src/types";
import { authFetch } from "../api/authFetch";
import { getRoutes } from "../api/routes";
import { requestJson } from "../utils/requestJson";
import {
  applyCollectionSearchParams,
  type CollectionListParams,
} from "@/src/hooks/collectionListParams";
import { useQuery } from "@tanstack/react-query";

export function useChannel() {
  const [listParams, setListParams] = useState<CollectionListParams | undefined>(undefined);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ["channels", "list", listParams],
    queryFn: async () => {
      const url = new URL(getRoutes().channel.list);
      applyCollectionSearchParams(url, listParams);

      const res = await authFetch(url.toString());
      if (!res.ok) throw new Error("Erreur de récupération des chaines.");
      const data = await requestJson<Channel[] | { results?: Channel[]; count?: number }>(res);
      
      const normalizedChannels = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];
      const count = !Array.isArray(data) && typeof data.count === "number"
        ? data.count
        : normalizedChannels.length;

      return { channels: normalizedChannels, count };
    },
    staleTime: 30000,
    enabled: listParams !== undefined,
  });

  const detailQuery = useQuery({
    queryKey: ["channels", "detail", currentSlug],
    queryFn: async () => {
      if (!currentSlug) return null;
      const res = await authFetch(getRoutes().channel.get(currentSlug));
      if (!res.ok) throw new Error("Erreur de récupération de la chaine.");
      return requestJson<Channel>(res);
    },
    enabled: !!currentSlug,
    staleTime: 30000,
  });

  const fetchAll = useCallback(async (params?: CollectionListParams) => {
    setListParams(params);
    return listQuery.data?.channels ?? [];
  }, [listQuery.data]);

  const fetchOne = useCallback(async (slug: string) => {
    setCurrentSlug(slug);
    try {
      const res = await authFetch(getRoutes().channel.get(slug));
      const data = await requestJson<Channel>(res);
      return data;
    } catch {
      return null;
    }
  }, []);

  return {
    channels: listQuery.data?.channels ?? [],
    channelsCount: listQuery.data?.count ?? 0,
    channel: detailQuery.data ?? null,
    fetchAll,
    fetchOne,
    useChannelLoading:
      (listParams !== undefined && listQuery.isLoading) ||
      (!!currentSlug && detailQuery.isLoading),
    useChannelError:
      (listParams !== undefined ? (listQuery.error?.message ?? null) : null) ||
      (currentSlug ? (detailQuery.error?.message ?? null) : null),
  };
}
