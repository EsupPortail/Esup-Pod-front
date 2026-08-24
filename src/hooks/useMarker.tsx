import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";
import { getRoutes } from "../api/routes";

export const useMarker = (videoSlug: string) => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const { data: markerTime, isLoading } = useQuery<{ marker: number }>({
    queryKey: ["marker", videoSlug],
    queryFn: async () => {
      const res = await authFetch(getRoutes().video.marker(videoSlug), authOpts);
      if (res.status === 404) return { marker: 0 };
      return requestJson(res);
    },
    enabled: !!accessToken && !!videoSlug,
  });

  const saveMarkerMutation = useMutation({
    mutationFn: async (time: number) => {
      if (!accessToken) return null;
      try {
        const res = await authFetch(getRoutes().video.saveMarker(videoSlug), {
          ...authOpts,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ marker: time }),
        });
        if (!res.ok) return null;
        return requestJson(res);
      } catch {
        return null;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marker", videoSlug] });
    },
  });

  const resetMarkerMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) return null;
      try {
        const res = await authFetch(getRoutes().video.resetMarker(videoSlug), {
          ...authOpts,
          method: "DELETE",
        });
        if (!res.ok || res.status === 204) return null;
        return requestJson(res);
      } catch {
        return null;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marker", videoSlug] });
    },
  });

  return {
    markerTime: markerTime?.marker || 0,
    isLoading,
    saveMarker: saveMarkerMutation.mutateAsync,
    resetMarker: resetMarkerMutation.mutateAsync,
  };
};
