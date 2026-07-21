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
  id: string;
  title: string;
  watermark: CustomImage | null;
  watermark_url?: string;
  screen_start?: CustomImage | null;
  screen_start_url?: string;
  screen_end?: CustomImage | null;
  screen_end_url?: string;
  margin: number;
  opacity: number;
  size: number;
  x_position: number;
  y_position: number;
}

export const useWatermarks = () => {
  const queryClient = useQueryClient();
  const { accessToken, refresh: refreshAuthToken } = useAuth();
  
  const authOpts = { accessToken, onRefresh: refreshAuthToken };

  const { data, isLoading, error } = useQuery<CustomImage[]>({
    queryKey: ["watermarks"],
    queryFn: async () => {
      const res = await authFetch("/api/dressing/watermarks/", authOpts);
      return requestJson(res);
    },
    enabled: !!accessToken,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await authFetch("/api/dressing/watermarks/", {
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
      const res = await authFetch(`/api/dressing/watermarks/${id}/`, {
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
      const res = await authFetch("/api/dressing/dressing/", authOpts);
      return requestJson(res);
    },
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: async (dressingData: Partial<Dressing>) => {
      const res = await authFetch("/api/dressing/dressing/", {
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
      const res = await authFetch(`/api/dressing/dressing/${id}/`, {
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
      const res = await authFetch(`/api/dressing/dressing/${id}/`, {
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
