import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";
import { getRoutes } from "../api/routes";

export const useBulkActions = () => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };
  const routes = getRoutes();

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ videoIds, fields }: { videoIds: number[]; fields: Record<string, any> }) => {
      const res = await authFetch(routes.video.bulk, {
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
      const res = await authFetch(routes.video.bulk, {
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
