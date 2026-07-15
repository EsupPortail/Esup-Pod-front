"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { Playlist, PlaylistRequest } from "@/src/types";
import { applyCollectionSearchParams, type CollectionListParams } from "@/src/hooks/collectionListParams";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type UpdatePlaylistPayload = Partial<PlaylistRequest>;
type PlaylistItemPayload = { video_id: number };
type ReorderPayload = { ordering: number[] };

export function usePlaylistList(
  params?: CollectionListParams,
  options?: { enabled?: boolean }
) {
  const { accessToken, refresh } = useAuth();

  const query = useInfiniteQuery({
    queryKey: ["playlists", "list", params],
    queryFn: async ({ pageParam = 1 }) => {
      const url = new URL(getRoutes().playlist.list);
      applyCollectionSearchParams(url, { ...params, page: pageParam as number });

      const res = await authFetch(url.toString(), { accessToken, onRefresh: refresh });
      if (!res.ok) throw new Error("Erreur de chargement des playlists.");

      return requestJson<Playlist[] | { results?: Playlist[]; count?: number; next?: string }>(res);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!Array.isArray(lastPage) && lastPage.next) return allPages.length + 1;
      return undefined;
    },
    initialPageParam: 1,
    enabled: options?.enabled ?? true,
  });

  const playlists = query.data?.pages.flatMap((page) => {
    if (Array.isArray(page)) return page;
    if (Array.isArray(page.results)) return page.results;
    return [];
  }) ?? [];

  const firstPage = query.data?.pages[0];
  const playlistsCount = !Array.isArray(firstPage) && firstPage?.count !== undefined ? firstPage.count : playlists.length;

  return {
    playlists,
    playlistsCount,
    usePlaylistLoading: (options?.enabled ?? true) && query.isLoading,
    usePlaylistError: (options?.enabled ?? true) ? (query.error?.message ?? null) : null,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

// Rétrocompatibilité : Retourne toutes les méthodes attendues par tes anciens composants
export function usePlaylist() {
  const { accessToken, refresh } = useAuth();
  const queryClient = useQueryClient();
  const [listParams, setListParams] = useState<CollectionListParams | undefined>(undefined);
  const listQuery = usePlaylistList(listParams, { enabled: listParams !== undefined });
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  const playlistQuery = useQuery({
    queryKey: ["playlists", "detail", currentSlug],
    queryFn: async () => {
      if (!currentSlug) return null;
      const res = await authFetch(getRoutes().playlist.get(currentSlug), {
        accessToken,
        onRefresh: refresh,
      });
      if (!res.ok) throw new Error("Erreur de chargement de la playlist.");
      return requestJson<Playlist>(res);
    },
    enabled: !!currentSlug,
  });

  const mutationConfig = {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["playlists"] }),
  };

  const createMut = useMutation({
    mutationFn: async (payload: PlaylistRequest) => {
      const res = await authFetch(getRoutes().playlist.add, {
        accessToken, onRefresh: refresh, method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return requestJson<Playlist>(res);
    }, ...mutationConfig
  });

  const updateMut = useMutation({
    mutationFn: async ({ slug, payload }: { slug: string; payload: UpdatePlaylistPayload }) => {
      const res = await authFetch(getRoutes().playlist.update(slug), {
        accessToken,
        onRefresh: refresh,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur modification playlist");
      return requestJson<Playlist>(res);
    }, ...mutationConfig
  });

  const deleteMut = useMutation({
    mutationFn: async (slug: string) => {
      const res = await authFetch(getRoutes().playlist.delete(slug), {
        accessToken, onRefresh: refresh, method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression playlist");
      return slug;
    }, ...mutationConfig
  });

  const addVideoMut = useMutation({
    mutationFn: async ({ slug, payload }: { slug: string; payload: PlaylistItemPayload }) => {
      const res = await authFetch(getRoutes().playlist.addVideo(slug), {
        accessToken,
        onRefresh: refresh,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur ajout vidéo dans playlist");
      return requestJson<Playlist>(res);
    }, ...mutationConfig
  });

  const deleteVideoMut = useMutation({
    mutationFn: async ({ slug, payload }: { slug: string; payload: PlaylistItemPayload }) => {
      const res = await authFetch(getRoutes().playlist.deleteVideo(slug), {
        accessToken,
        onRefresh: refresh,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur retrait vidéo de playlist");
      return requestJson<Playlist>(res);
    }, ...mutationConfig
  });

  return {
    playlist: playlistQuery.data ?? null,
    playlists: listQuery.playlists,
    playlistsCount: listQuery.playlistsCount,
    usePlaylistLoading:
      (listParams !== undefined && listQuery.usePlaylistLoading) ||
      (!!currentSlug && playlistQuery.isLoading),
    usePlaylistError:
      (listParams !== undefined ? (listQuery.usePlaylistError ?? null) : null) ||
      (currentSlug ? (playlistQuery.error?.message ?? null) : null),

    // Remplacement par les mutations
    // Remplacement par les mutations
    fetchAll: useCallback(async (newParams?: CollectionListParams) => {
      setListParams(newParams);
      return []; // Return type doesn't matter for the effect, returning empty is safe.
    }, []),
    fetchOne: useCallback(async (slug: string) => {
      setCurrentSlug(slug);
      try {
        const res = await authFetch(getRoutes().playlist.get(slug), {
          accessToken,
          onRefresh: refresh,
        });
        const data = await requestJson<Playlist>(res);
        return data;
      } catch {
        return null;
      }
    }, [accessToken, refresh]),
    createPlaylist: createMut.mutateAsync,
    updatePlaylist: useCallback(async (slug: string, payload: UpdatePlaylistPayload) => {
      return updateMut.mutateAsync({ slug, payload });
    }, [updateMut.mutateAsync]),
    deletePlaylist: deleteMut.mutateAsync,
    addVideo: useCallback(async (slug: string, payload: PlaylistItemPayload) => {
      return addVideoMut.mutateAsync({ slug, payload });
    }, [addVideoMut.mutateAsync]),
    deleteVideo: useCallback(async (slug: string, payload: PlaylistItemPayload) => {
      return deleteVideoMut.mutateAsync({ slug, payload });
    }, [deleteVideoMut.mutateAsync]),
    reorder: useCallback(async (_slug: string, _payload: ReorderPayload) => null, []),
    addVideoToState: useCallback(() => { }, []),
    removeVideoFromState: useCallback(() => { }, []),
  };
}