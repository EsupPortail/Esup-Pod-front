import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "../api/authFetch";
import { requestJson } from "../utils/requestJson";
import { useAuth } from "../context/AuthProvider";
import { VideoDocument } from "../types/video";
import { getRoutes } from "../api/routes";

export function useDocuments(videoId: number | undefined) {
  const { accessToken, refresh } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["documents", videoId],
    queryFn: async () => {
      const response = await authFetch(getRoutes().documents.list(videoId), {
        accessToken,
        onRefresh: refresh,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      // If it's paginated, adapt here.
      // Usually DRF returns { results: [] } if paginated, or [] if unpaginated.
      // Let's assume paginated and return data.results or data
      const data = await requestJson<any>(response);
      return (data.results !== undefined ? data.results : data) as VideoDocument[];
    },
    enabled: !!videoId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { title: string; file: File; is_private: boolean }) => {
      const formData = new FormData();
      formData.append("video", videoId!.toString());
      formData.append("title", data.title);
      formData.append("is_private", data.is_private.toString());
      formData.append("file", data.file);

      const response = await authFetch(getRoutes().documents.add, {
        method: "POST",
        body: formData,
        accessToken,
        onRefresh: refresh,
      });

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }
      return requestJson<VideoDocument>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", videoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const response = await authFetch(getRoutes().documents.delete(documentId), {
        method: "DELETE",
        accessToken,
        onRefresh: refresh,
      });
      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete document");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", videoId] });
    },
  });

  return {
    documents,
    isLoading,
    error,
    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    deleteDocument: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
