"use client";

import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/src/api/authFetch";
import { useAuth } from "@/src/context/AuthProvider";
import { requestJson } from "@/src/utils/requestJson";
import type { SocialNetwork } from "@/src/types";

export const useSocialNetworks = () => {
  const { accessToken, refresh } = useAuth();
  const authOpts = { accessToken, onRefresh: refresh };

  const { data: socialNetworks, isLoading, error } = useQuery<SocialNetwork[]>({
    queryKey: ["social-networks"],
    queryFn: async () => {
      const res = await authFetch("/api/social-networks/", authOpts);
      if (!res.ok) {
        throw new Error("Impossible de charger les réseaux sociaux.");
      }
      const data = await requestJson<SocialNetwork[] | { results: SocialNetwork[] }>(res);
      return Array.isArray(data) ? data : data.results || [];
    },
  });

  return {
    socialNetworks: socialNetworks || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
