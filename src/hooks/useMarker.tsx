import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";

export const useMarker = (videoSlug: string) => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const { data: markerTime, isLoading } = useQuery<{ time: number }>({
    queryKey: ["marker", videoSlug],
    queryFn: async () => {
      const res = await authFetch(`/api/marker/${videoSlug}/`, authOpts);
      if (res.status === 404) return { time: 0 };
      return requestJson(res);
    },
    enabled: !!accessToken && !!videoSlug,
  });

  const saveMarkerMutation = useMutation({
    mutationFn: async (time: number) => {
      const res = await authFetch(`/api/marker/${videoSlug}/save/`, {
        ...authOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time }),
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marker", videoSlug] });
    },
  });

  const resetMarkerMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch(`/api/marker/${videoSlug}/reset/`, {
        ...authOpts,
        method: "DELETE",
      });
      if (res.status === 204) return null;
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marker", videoSlug] });
    },
  });

  return {
    markerTime: markerTime?.time || 0,
    isLoading,
    saveMarker: saveMarkerMutation.mutateAsync,
    resetMarker: resetMarkerMutation.mutateAsync,
  };
};
