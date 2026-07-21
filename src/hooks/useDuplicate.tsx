import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";

export const useDuplicate = (videoSlug: string) => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const duplicateMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch(`/api/videos/${videoSlug}/duplicate/`, {
        ...authOpts,
        method: "POST",
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  return {
    duplicateVideo: duplicateMutation.mutateAsync,
    isDuplicating: duplicateMutation.isPending,
  };
};
