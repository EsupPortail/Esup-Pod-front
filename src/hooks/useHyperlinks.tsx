import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";

export interface Hyperlink {
  id: string;
  timecode: number;
  url: string;
  text: string;
}

export const useHyperlinks = (videoSlug: string) => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const { data: hyperlinks, isLoading } = useQuery<Hyperlink[]>({
    queryKey: ["hyperlinks", videoSlug],
    queryFn: async () => {
      const res = await authFetch(`/api/hyperlink/${videoSlug}/hyperlinks/`, authOpts);
      return requestJson(res);
    },
    enabled: !!accessToken && !!videoSlug,
  });

  const addMutation = useMutation({
    mutationFn: async (link: Omit<Hyperlink, "id">) => {
      const res = await authFetch(`/api/hyperlink/${videoSlug}/hyperlinks/add/`, {
        ...authOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(link),
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hyperlinks", videoSlug] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const res = await authFetch(`/api/hyperlink/${videoSlug}/hyperlinks/${linkId}/`, {
        ...authOpts,
        method: "DELETE",
      });
      if (res.status === 204) return null;
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hyperlinks", videoSlug] });
    },
  });

  return {
    hyperlinks: hyperlinks || [],
    isLoading,
    addHyperlink: addMutation.mutateAsync,
    deleteHyperlink: deleteMutation.mutateAsync,
  };
};
