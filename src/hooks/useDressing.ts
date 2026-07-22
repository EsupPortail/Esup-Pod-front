import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";
import { getRoutes } from "../api/routes";

export interface CustomImage {
  id: string;
  image: string; // URL
  created_at: string;
  created_by?: string;
  // TODO: define exact fields based on CustomImageModel
}

export interface Dressing {
  id: number;
  title: string;
  watermark?: CustomImage | number | null;
  watermark_url?: string;
  position?: string;
  opacity?: number;
  opening_credits?: number | null;
  ending_credits?: number | null;
  margin?: number;
  size?: number;
  x_position?: number;
  y_position?: number;
}

export const useWatermarks = () => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const { data, isLoading, error } = useQuery<CustomImage[]>({
    queryKey: ["watermarks"],
    queryFn: async () => {
      const res = await authFetch(getRoutes().dressing.watermarks, authOpts);
      const json = await requestJson<CustomImage[] | { results: CustomImage[] }>(res);
      return Array.isArray(json) ? json : (json as any).results ?? [];
    },
    enabled: !!accessToken,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await authFetch(getRoutes().dressing.watermarks, {
        ...authOpts,
        method: "POST",
        body: formData,
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watermarks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(getRoutes().dressing.watermark(Number(id)), {
        ...authOpts,
        method: "DELETE",
      });
      if (res.status === 204) return null;
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watermarks"] });
    },
  });

  return {
    watermarks: data || [],
    isLoading,
    error,
    uploadWatermark: uploadMutation.mutateAsync,
    deleteWatermark: deleteMutation.mutateAsync,
  };
};

export const useDressings = () => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const { data, isLoading, error } = useQuery<Dressing[]>({
    queryKey: ["dressings"],
    queryFn: async () => {
      const res = await authFetch(getRoutes().dressing.dressings, authOpts);
      const json = await requestJson<Dressing[] | { results: Dressing[] }>(res);
      return Array.isArray(json) ? json : (json as any).results ?? [];
    },
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: async (dressingData: Partial<Dressing>) => {
      const res = await authFetch(getRoutes().dressing.dressings, {
        ...authOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dressingData),
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dressings"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Dressing> }) => {
      const res = await authFetch(getRoutes().dressing.dressing(Number(id)), {
        ...authOpts,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dressings"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(getRoutes().dressing.dressing(Number(id)), {
        ...authOpts,
        method: "DELETE",
      });
      if (res.status === 204) return null;
      return requestJson(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dressings"] });
    },
  });

  return {
    dressings: data || [],
    isLoading,
    error,
    createDressing: createMutation.mutateAsync,
    updateDressing: updateMutation.mutateAsync,
    deleteDressing: deleteMutation.mutateAsync,
  };
};
