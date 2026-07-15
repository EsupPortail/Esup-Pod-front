import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";

export const useVideoCut = (videoSlug: string) => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const cutMutation = useMutation({
    mutationFn: async ({ start, end }: { start: number; end: number }) => {
      const res = await authFetch(`/api/cut/${videoSlug}/`, {
        ...authOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end }),
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoSlug] });
    },
  });

  const deleteCutMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch(`/api/cut/${videoSlug}/delete/`, {
        ...authOpts,
        method: "DELETE",
      });
      if (res.status === 204) return null;
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoSlug] });
    },
  });

  return {
    cutVideo: cutMutation.mutateAsync,
    deleteCut: deleteCutMutation.mutateAsync,
    isCutting: cutMutation.isPending,
  };
};
