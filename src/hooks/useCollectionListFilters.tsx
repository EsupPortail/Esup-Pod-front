"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChannel } from "@/src/hooks/useChannel";
import { usePlaylist } from "@/src/hooks/usePlaylist";
import { useTheme } from "@/src/hooks/useTheme";
import { useUsers } from "@/src/hooks/useUsers";
import {
  INITIAL_COLLECTION_FILTERS,
  type CollectionFilterMode,
  type CollectionFiltersValue,
} from "@/src/components/collection/filters/CollectionFilters";
import type { CollectionListParams } from "@/src/hooks/collectionListParams";
import { useAuth } from "@/src/context/AuthProvider"; // <-- ajout

type UseCollectionListFiltersOptions = {
  mode: CollectionFilterMode;
  enabled?: boolean;
};

export function useCollectionListFilters({
  mode,
  enabled = true,
}: UseCollectionListFiltersOptions) {
  const [filters, setFilters] = useState<CollectionFiltersValue>(
    INITIAL_COLLECTION_FILTERS,
  );

  const { users, fetchAll: fetchUsers } = useUsers();

  const {
    channels,
    fetchAll: fetchChannels,
    useChannelError,
    useChannelLoading,
  } = useChannel();

  const {
    playlists,
    fetchAll: fetchPlaylists,
    usePlaylistError,
    usePlaylistLoading,
  } = usePlaylist();

  const {
    themes,
    fetchAll: fetchThemes,
    useThemeError,
    useThemeLoading,
  } = useTheme();

  const { accessToken } = useAuth();
  const fetchedMetadataRef = useRef(false);
  const lastRequestKeyRef = useRef<string | null>(null);

  const collectionListParams = useMemo<CollectionListParams>(
    () => ({
      ordering: filters.ordering || undefined,
      search: filters.search || undefined,
      ownerUsernames: filters.ownerUsernames,
      createdAtGte: filters.createdAtGte || undefined,
      createdAtLte: filters.createdAtLte || undefined,
      channel: filters.channel ?? undefined,
    }),
    [
      filters.ordering,
      filters.search,
      filters.ownerUsernames,
      filters.createdAtGte,
      filters.createdAtLte,
      filters.channel,
    ],
  );

  const requestKey = useMemo(
    () =>
      JSON.stringify({
        mode,
        ...collectionListParams,
      }),
    [mode, collectionListParams],
  );

  useEffect(() => {
    // On attend d'avoir un accessToken pour charger les métadonnées dépendantes de l'auth
    if (!accessToken) return;
    if (fetchedMetadataRef.current) return;

    fetchUsers();

    if (mode === "themes") {
      fetchChannels();
    }
    if (mode === "channels") {
      fetchThemes();
    }

    fetchedMetadataRef.current = true;
  }, [fetchUsers, fetchChannels, fetchThemes, mode, accessToken]);

  // Chargement de la collection selon le mode + filtres
  useEffect(() => {
    if (!enabled) return;
    if (lastRequestKeyRef.current === requestKey) return;

    lastRequestKeyRef.current = requestKey;

    if (mode === "channels") {
      fetchChannels(collectionListParams);
      return;
    }

    if (mode === "playlists") {
      fetchPlaylists(collectionListParams);
      return;
    }

    fetchThemes(collectionListParams);
  }, [
    enabled,
    mode,
    requestKey,
    collectionListParams,
    fetchChannels,
    fetchPlaylists,
    fetchThemes,
  ]);

  return {
    filters,
    setFilters,
    users,
    channels,
    playlists,
    themes,

    error: useChannelError ?? usePlaylistError ?? useThemeError,
    loading: useChannelLoading || usePlaylistLoading || useThemeLoading,
  };
}
