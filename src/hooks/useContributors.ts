import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoutes } from "@/src/api/routes";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { useAuth } from "@/src/context/AuthProvider";

export interface Contributor {
  id: number;
  first_name: string;
  last_name: string;
  email_address?: string;
  weblink?: string;
}

export interface Contribution {
  id: number;
  video: number;
  contributor_id: number;
  contributor_details: Contributor;
  role: string;
  job_title?: string;
}

interface ContributionsResponse {
  results: Contribution[];
  count: number;
}

interface ContributorsResponse {
  results: Contributor[];
  count: number;
}

export const useContributions = (videoId: number) => {
  const { accessToken, refresh } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["contributions", videoId],
    queryFn: async () => {
      if (!videoId) return [];
      const res = await authFetch(getRoutes().contributions.list(videoId), {
        accessToken,
        onRefresh: refresh,
      });
      const data = await requestJson<ContributionsResponse>(res);
      return data.results;
    },
    enabled: !!videoId && !!accessToken,
  });

  const addContribution = useMutation({
    mutationFn: async (payload: {
      video: number;
      contributor_id: number;
      role: string;
      job_title?: string;
    }) => {
      const res = await authFetch(getRoutes().contributions.add, {
        method: "POST",
        body: JSON.stringify(payload),
        accessToken,
        onRefresh: refresh,
        headers: { "Content-Type": "application/json" },
      });
      return await requestJson<Contribution>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributions", videoId] });
    },
  });

  const removeContribution = useMutation({
    mutationFn: async (id: number) => {
      await authFetch(getRoutes().contributions.delete(id), {
        method: "DELETE",
        accessToken,
        onRefresh: refresh,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributions", videoId] });
    },
  });

  return {
    contributions: query.data ?? [],
    isLoading: query.isLoading,
    addContribution,
    removeContribution,
  };
};

export const useContributorsSearch = (searchQuery: string) => {
  const { accessToken, refresh } = useAuth();

  return useQuery({
    queryKey: ["contributors", "search", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const res = await authFetch(
        getRoutes().contributors.search(searchQuery),
        {
          accessToken,
          onRefresh: refresh,
        }
      );
      const data = await requestJson<ContributorsResponse>(res);
      return data.results;
    },
    enabled: !!accessToken && searchQuery.length >= 2,
  });
};
