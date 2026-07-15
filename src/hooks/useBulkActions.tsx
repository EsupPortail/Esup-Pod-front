import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";

export const useBulkActions = () => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ videoIds, fields }: { videoIds: number[]; fields: any }) => {
      const res = await authFetch(`/api/videos/bulk/`, {
        ...authOpts,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_ids: videoIds, fields }),
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (videoIds: number[]) => {
      const res = await authFetch(`/api/videos/bulk/`, {
        ...authOpts,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_ids: videoIds }),
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  return {
    bulkUpdate: bulkUpdateMutation.mutateAsync,
    bulkDelete: bulkDeleteMutation.mutateAsync,
    isUpdating: bulkUpdateMutation.isPending,
    isDeleting: bulkDeleteMutation.isPending,
  };
};
