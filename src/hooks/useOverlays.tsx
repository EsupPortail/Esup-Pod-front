import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";

export interface Overlay {
  id: string;
  timecode: number;
  text?: string;
  image_url?: string;
}

export const useOverlays = (videoSlug: string) => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const { data: overlays, isLoading } = useQuery<Overlay[]>({
    queryKey: ["overlays", videoSlug],
    queryFn: async () => {
      const res = await authFetch(`/api/overlays/${videoSlug}/`, authOpts);
      return requestJson(res);
    },
    enabled: !!accessToken && !!videoSlug,
  });

  const createMutation = useMutation({
    mutationFn: async (overlay: Omit<Overlay, "id">) => {
      const res = await authFetch(`/api/overlays/${videoSlug}/`, {
        ...authOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(overlay),
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overlays", videoSlug] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/overlays/${videoSlug}/${id}/`, {
        ...authOpts,
        method: "DELETE",
      });
      if (res.status === 204) return null;
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overlays", videoSlug] });
    },
  });

  return {
    overlays: overlays || [],
    isLoading,
    createOverlay: createMutation.mutateAsync,
    deleteOverlay: deleteMutation.mutateAsync,
  };
};
