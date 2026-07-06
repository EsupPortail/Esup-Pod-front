import { useState, useCallback } from "react";
import type { Channel } from "@/src/types";
import { authFetch } from "../api/authFetch";
import { getRoutes } from "../api/routes";
import { requestJson } from "../utils/requestJson";
import {
  applyCollectionSearchParams,
  type CollectionListParams,
} from "@/src/hooks/collectionListParams";

export function useChannel() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [useChannelLoading, setUseChannelLoading] = useState(false);
  const [useChannelError, setUseChannelError] = useState<string | null>(null);

  const normalizeChannelList = (
    data: Channel[] | { results?: Channel[] },
  ): Channel[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    return [];
  };

  const fetchAll = useCallback(async (params?: CollectionListParams) => {
    setUseChannelLoading(true);
    setUseChannelError(null);

    try {
      const url = new URL(getRoutes().channel.list);
      applyCollectionSearchParams(url, params);

      const res = await authFetch(url.toString());
      const data = await requestJson<Channel[] | { results?: Channel[] }>(res);
      const normalizedChannels = normalizeChannelList(data);

      setChannels(normalizedChannels);
      return normalizedChannels;
    } catch (e: unknown) {
      setUseChannelError(
        e instanceof Error ? e.message : "Erreur de récupération des chaines.",
      );
      return [];
    } finally {
      setUseChannelLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (slug: string) => {
    setUseChannelLoading(true);
    setUseChannelError(null);

    try {
      const res = await authFetch(getRoutes().channel.get(slug));
      const data = await requestJson<Channel>(res);

      setChannel(data);
      return data;
    } catch (e: unknown) {
      setUseChannelError(
        e instanceof Error ? e.message : "Erreur de récupération de la chaine.",
      );
      return null;
    } finally {
      setUseChannelLoading(false);
    }
  }, []);

  return {
    channels,
    channel,
    fetchAll,
    fetchOne,
    useChannelLoading,
    useChannelError,
  };
}
