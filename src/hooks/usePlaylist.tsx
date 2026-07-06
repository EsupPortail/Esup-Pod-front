"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { Playlist, PlaylistRequest, Video } from "@/src/types";
import {
  applyCollectionSearchParams,
  type CollectionListParams,
} from "@/src/hooks/collectionListParams";

type UpdatePlaylistPayload = Partial<PlaylistRequest>;

type PlaylistItemPayload = {
  video_id: number;
};

type ReorderPayload = {
  ordering: number[];
};

const ensureResponseOk = (response: Response, message: string) => {
  if (!response.ok) {
    throw new Error(message);
  }
};

export function usePlaylist() {
  const { accessToken, refresh } = useAuth();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [usePlaylistLoading, setUsePlaylistLoading] = useState(false);
  const [usePlaylistError, setUsePlaylistError] = useState<string | null>(null);

  const normalizePlaylistList = (
    data: Playlist[] | { results?: Playlist[] },
  ): Playlist[] => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    return [];
  };

  const fetchAll = useCallback(
    async (params?: CollectionListParams) => {
      setUsePlaylistLoading(true);
      setUsePlaylistError(null);

      try {
        const url = new URL(getRoutes().playlist.list);
        applyCollectionSearchParams(url, params);

        const res = await authFetch(url.toString(), {
          accessToken,
          onRefresh: refresh,
        });

        const data = await requestJson<Playlist[] | { results?: Playlist[] }>(
          res,
        );
        const normalizedPlaylists = normalizePlaylistList(data);

        setPlaylists(normalizedPlaylists);
        return normalizedPlaylists;
      } catch (e: unknown) {
        setUsePlaylistError(
          e instanceof Error
            ? e.message
            : "Erreur de chargement des playlists.",
        );
        return [];
      } finally {
        setUsePlaylistLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const fetchOne = useCallback(
    async (slug: string) => {
      setUsePlaylistLoading(true);
      setUsePlaylistError(null);

      try {
        const res = await authFetch(getRoutes().playlist.get(slug), {
          accessToken,
          onRefresh: refresh,
        });
        const data = await requestJson<Playlist>(res);
        setPlaylist(data);
        return data;
      } catch (e: unknown) {
        setUsePlaylistError(
          e instanceof Error
            ? e.message
            : "Erreur de chargement de la playlist.",
        );
        return null;
      } finally {
        setUsePlaylistLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const createPlaylist = useCallback(
    async (payload: PlaylistRequest) => {
      setUsePlaylistLoading(true);
      setUsePlaylistError(null);

      try {
        const res = await authFetch(getRoutes().playlist.add, {
          accessToken,
          onRefresh: refresh,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await requestJson<Playlist>(res);
        setPlaylists((prev) => [data, ...prev]);
        return data;
      } catch (e: unknown) {
        setUsePlaylistError(
          e instanceof Error
            ? e.message
            : "Erreur lors de la création de la playlist.",
        );
        return null;
      } finally {
        setUsePlaylistLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const updatePlaylist = useCallback(
    async (slug: string, payload: UpdatePlaylistPayload) => {
      setUsePlaylistLoading(true);
      setUsePlaylistError(null);

      try {
        const res = await authFetch(getRoutes().playlist.update(slug), {
          accessToken,
          onRefresh: refresh,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await requestJson<Playlist>(res);
        setPlaylist(data);
        setPlaylists((prev) =>
          prev.map((item) => (item.slug === data.slug ? data : item)),
        );
        return data;
      } catch (e: unknown) {
        setUsePlaylistError(
          e instanceof Error
            ? e.message
            : "Erreur lors de la mise à jour de la playlist.",
        );
        return null;
      } finally {
        setUsePlaylistLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const deletePlaylist = useCallback(
    async (slug: string) => {
      setUsePlaylistLoading(true);
      setUsePlaylistError(null);

      try {
        const res = await authFetch(getRoutes().playlist.delete(slug), {
          accessToken,
          onRefresh: refresh,
          method: "DELETE",
        });
        ensureResponseOk(res, "Erreur lors de la suppression de la playlist.");
        setPlaylists((prev) => prev.filter((item) => item.slug !== slug));
        setPlaylist((current) => (current?.slug === slug ? null : current));
        return true;
      } catch (e: unknown) {
        setUsePlaylistError(
          e instanceof Error
            ? e.message
            : "Erreur lors de la suppression de la playlist.",
        );
        return false;
      } finally {
        setUsePlaylistLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const addVideo = useCallback(
    async (slug: string, payload: PlaylistItemPayload) => {
      setUsePlaylistLoading(true);
      setUsePlaylistError(null);

      try {
        const res = await authFetch(getRoutes().playlist.addVideo(slug), {
          accessToken,
          onRefresh: refresh,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await requestJson<Playlist>(res);
        setPlaylist(data);
        return data;
      } catch (e: unknown) {
        setUsePlaylistError(
          e instanceof Error
            ? e.message
            : "Erreur lors de l'ajout de la vidéo à la playlist.",
        );
        return null;
      } finally {
        setUsePlaylistLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const deleteVideo = useCallback(
    async (slug: string, payload: PlaylistItemPayload) => {
      setUsePlaylistLoading(true);
      setUsePlaylistError(null);

      try {
        const res = await authFetch(getRoutes().playlist.deleteVideo(slug), {
          accessToken,
          onRefresh: refresh,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await requestJson<Playlist>(res);
        setPlaylist(data);
        return data;
      } catch (e: unknown) {
        setUsePlaylistError(
          e instanceof Error
            ? e.message
            : "Erreur lors de la suppression de la vidéo de la playlist.",
        );
        return null;
      } finally {
        setUsePlaylistLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const reorder = useCallback(
    async (slug: string, payload: ReorderPayload) => {
      setUsePlaylistLoading(true);
      setUsePlaylistError(null);

      try {
        const res = await authFetch(getRoutes().playlist.reorder(slug), {
          accessToken,
          onRefresh: refresh,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await requestJson<Playlist>(res);
        setPlaylist(data);
        return data;
      } catch (e: unknown) {
        setUsePlaylistError(
          e instanceof Error
            ? e.message
            : "Erreur lors du réordonnancement de la playlist.",
        );
        return null;
      } finally {
        setUsePlaylistLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const addVideoToState = useCallback((video: Video) => {
    setPlaylist((current) => {
      if (!current) return current;
      const items = current.items ?? [];
      return {
        ...current,
        items: [video, ...items],
      };
    });
  }, []);

  const removeVideoFromState = useCallback((videoId: number) => {
    setPlaylist((current) => {
      if (!current) return current;
      const items = current.items ?? [];
      return {
        ...current,
        items: items.filter((item) => item.id !== videoId),
      };
    });
  }, []);

  return {
    playlist,
    playlists,
    usePlaylistLoading,
    usePlaylistError,
    fetchAll,
    fetchOne,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideo,
    deleteVideo,
    reorder,
    addVideoToState,
    removeVideoFromState,
  };
}
