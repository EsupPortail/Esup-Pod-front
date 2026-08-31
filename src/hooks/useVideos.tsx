"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { getRoutes } from "@/src/api/routes";
import type { Video } from "@/src/types";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type UnlockPayload = {
  password?: string;
  hash?: string;
};

type UnlockResponse = {
  video_url?: string;
  source?: string;
  error?: string;
};

/**
 * Paramètres de filtrage, de tri et de pagination pour récupérer une liste de vidéos.
 * Ces paramètres correspondent aux filtres Django exposés par l'API (via django-filter).
 */
export type VideoListParams = {
  /** Filtrer par ID de chaîne (Channel) */
  channel?: number;
  ordering?: string;
  search?: string;
  page?: number;
  createdAtGte?: string;
  createdAtLte?: string;
  typeSlugs?: string[];
  disciplineIds?: number[];
  tagSlugs?: string[];
  tagNames?: string[];
  cursusSlugs?: string[];
  statuses?: string[];
  ownerUsernames?: string[];
};

const appendValues = (
  searchParams: URLSearchParams,
  name: string,
  values?: Array<string | number>,
) => {
  values
    ?.filter((value) => String(value).trim() !== "")
    .forEach((value) => searchParams.append(name, String(value)));
};

const buildVideoListUrl = (
  baseUrl: string,
  params?: VideoListParams,
): string => {
  const url = new URL(baseUrl);

  if (params?.channel != null) url.searchParams.set("channel", String(params.channel));
  if (params?.ordering) url.searchParams.set("ordering", params.ordering);
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.page != null) url.searchParams.set("page", String(params.page));
  if (params?.createdAtGte) url.searchParams.set("created_at__gte", params.createdAtGte);
  if (params?.createdAtLte) url.searchParams.set("created_at__lte", params.createdAtLte);

  appendValues(url.searchParams, "type__slug", params?.typeSlugs);
  appendValues(url.searchParams, "discipline", params?.disciplineIds);
  appendValues(url.searchParams, "tags__slug", params?.tagSlugs);
  appendValues(url.searchParams, "tags__name", params?.tagNames);
  appendValues(url.searchParams, "cursus__slug", params?.cursusSlugs);
  appendValues(url.searchParams, "status", params?.statuses);
  appendValues(url.searchParams, "owner__username", params?.ownerUsernames);

  return url.toString();
};

type VideoListResponse = Video[] | { results?: Video[]; count?: number; next?: string; previous?: string };

const normalizeVideoList = (data: VideoListResponse): Video[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
};

// --- React Query Hooks ---

export function useVideo(slug: string, enabled = true) {
  const { accessToken, refresh } = useAuth();

  return useQuery<Video, Error>({
    queryKey: ["video", slug],
    queryFn: async () => {
      const res = await authFetch(getRoutes().video.get(slug), {
        accessToken,
        onRefresh: refresh,
      });

      if (res.status === 404 && !accessToken) throw new Error("AUTH_REQUIRED");
      if (!res.ok) throw new Error("Erreur de chargement de la vidéo.");

      return requestJson<Video>(res);
    },
    enabled: Boolean(slug) && enabled,
    staleTime: 60000, // 1 minute stale time for individual video cache
  });
}

/**
 * Hook personnalisé basé sur React Query (useInfiniteQuery) pour récupérer une liste de vidéos avec support de pagination infinie, filtrage et mise en cache.
 *
 * @param params Objet contenant les critères de recherche, de tri et de filtre (`VideoListParams`).
 * @param fetchType Détermine la route API utilisée : "all" (toutes les vidéos publiques/accessibles) ou "me" (vidéos de l'utilisateur connecté).
 * @param options Options supplémentaires, ex: `enabled` pour conditionner l'exécution de la requête.
 * 
 * @returns Un objet contenant les vidéos (`videos`), le compte total (`videosCount`), l'état de chargement (`useVideoLoading`), les erreurs (`useVideoError`), et les fonctions pour charger la page suivante.
 */
export function useVideosList(
  params?: VideoListParams,
  fetchType: "all" | "me" = "all",
  options?: { enabled?: boolean }
) {
  const { accessToken, refresh } = useAuth();

  const query = useInfiniteQuery<VideoListResponse, Error>({
    queryKey: ["videos", fetchType, params],
    queryFn: async ({ pageParam = 1 }) => {
      // UTILISATION DE LA ROUTE OPTIMISÉE POUR RECUPÉRER PROPRIETAIRE + CO-PROPRIETAIRE
      const baseUrl = fetchType === "me" ? getRoutes().video.me : getRoutes().video.list;
      const response = await authFetch(buildVideoListUrl(baseUrl, { ...params, page: params?.page || (pageParam as number) }), {
        accessToken,
        onRefresh: refresh,
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Accès non autorisé (401). Veuillez vous connecter.");
        if (response.status === 404) throw new Error("Ressource introuvable (404).");
        if (response.status >= 500) throw new Error("Le serveur API est indisponible ou en erreur (500).");
        throw new Error(`Erreur lors du chargement des vidéos (${response.status}).`);
      }
      return requestJson<VideoListResponse>(response);
    },
    getNextPageParam: (lastPage, allPages) => {
      // Vérifie si un lien 'next' existe dans la réponse paginée de DRF
      if (!Array.isArray(lastPage) && lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    retry: 1,
    staleTime: 30000, // 30 seconds stale time for video lists
    enabled: options?.enabled ?? true,
  });

  // Aplatissement des pages pour retourner un simple tableau de vidéos
  const videos = query.data?.pages.flatMap(normalizeVideoList) ?? [];
  const videosCount = !Array.isArray(query.data?.pages[0]) ? query.data?.pages[0]?.count ?? videos.length : videos.length;

  return {
    videos,
    videosCount,
    useVideoLoading: (options?.enabled ?? true) && query.isLoading,
    useVideoError: (options?.enabled ?? true) ? (query.error?.message ?? null) : null,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useDeleteVideo() {
  const { accessToken, refresh } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await authFetch(getRoutes().video.delete(slug), {
        accessToken,
        onRefresh: refresh,
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression de la vidéo.");
      return slug;
    },
    onSuccess: (deletedSlug) => {
      // Nettoie le cache pour forcer un rafraichissement
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.removeQueries({ queryKey: ["video", deletedSlug] });
    },
  });
}

export function useUnlockVideo() {
  const { accessToken, refresh } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, payload }: { slug: string; payload?: UnlockPayload }) => {
      const hasPayload = payload != null && Object.values(payload).some((value) => value);
      const hasHash = Boolean(payload?.hash?.trim());
      const baseUnlockUrl = getRoutes().video.unlock(slug);
      const unlockUrl = hasHash
        ? `${baseUnlockUrl}?hash=${encodeURIComponent(payload?.hash ?? "")}`
        : baseUnlockUrl;

      const res = await authFetch(unlockUrl, {
        accessToken,
        onRefresh: refresh,
        method: hasPayload ? "POST" : "GET",
        headers: hasPayload ? { "Content-Type": "application/x-www-form-urlencoded" } : undefined,
        body: hasPayload
          ? new URLSearchParams({
            password: payload?.password?.trim() || "",
            hash: payload?.hash?.trim() || "",
          })
          : undefined,
      });

      const data = await requestJson<UnlockResponse>(res);
      if (data.error) throw new Error(data.error);
      return { slug, data };
    },
    onSuccess: ({ slug, data }) => {
      if (data.video_url) {
        queryClient.setQueryData<Video>(["video", slug], (oldData) => {
          if (!oldData) return oldData;
          return { ...oldData, video_url: data.video_url! };
        });
      }
    },
  });
}

export function useDuplicateVideo() {
  const { accessToken, refresh } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await authFetch(
        getRoutes().video.duplicate(slug),
        {
          method: "POST",
          accessToken,
          onRefresh: refresh,
        }
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la duplication de la vidéo.");
      }
      return requestJson<Video>(response);
    },
    onSuccess: (newVideo) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}
