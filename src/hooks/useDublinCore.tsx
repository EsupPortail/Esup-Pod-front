import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";

export const useDublinCore = (videoSlug: string) => {
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const { data: dublinCoreData, isLoading } = useQuery<string>({
    queryKey: ["dublinCore", videoSlug],
    queryFn: async () => {
      // Assuming it returns XML
      const res = await authFetch(`/api/dublin-core/${videoSlug}/`, {
        ...authOpts,
        headers: { Accept: "application/xml" },
      });
      return res.text();
    },
    enabled: !!accessToken && !!videoSlug,
  });

  return {
    dublinCoreData,
    isLoading,
  };
};
