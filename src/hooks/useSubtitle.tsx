import { useState, useCallback } from "react";
import { LanguageSubtitle } from "@/src/constants/language";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { getRoutes } from "../api/routes";

type AddSubtitlePayload = {
  video: number;
  language: LanguageSubtitle;
  file: File;
  is_default: boolean;
};

export function useSubtitle() {
  const { accessToken, refresh } = useAuth();
  const [useSubtitleLoading, setUseSubtitleLoading] = useState(false);
  const [useSubtitleError, setUseSubtitleError] = useState<string | null>(null);

  const deleteSubtitle = useCallback(
    async (id: number) => {
      setUseSubtitleLoading(true);
      setUseSubtitleError(null);
      try {
        const res = await authFetch(getRoutes().subtitles.delete(id), {
          accessToken,
          onRefresh: refresh,
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Erreur lors de la suppression du sous-titre.");
        }

        return true;
      } catch (e: unknown) {
        setUseSubtitleError(
          e instanceof Error
            ? e.message
            : "Erreur lors de la suppression du sous-titre.",
        );
        return false;
      } finally {
        setUseSubtitleLoading(false);
      }
    },
    [accessToken, refresh],
  );

  const addSubtitle = useCallback(
    async ({ video, language, file, is_default }: AddSubtitlePayload) => {
      setUseSubtitleLoading(true);
      setUseSubtitleError(null);
      try {
        const formData = new FormData();
        formData.append("video", video.toString());
        formData.append("language", language);
        formData.append("file", file);
        formData.append("is_default", is_default.toString());

        const res = await authFetch(getRoutes().subtitles.add, {
          accessToken,
          onRefresh: refresh,
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Erreur lors de l'ajout du sous-titre.");
        }

        return true;
      } catch (e: unknown) {
        setUseSubtitleError(
          e instanceof Error
            ? e.message
            : "Erreur lors de l'ajout du sous-titre.",
        );
        return false;
      } finally {
        setUseSubtitleLoading(false);
      }
    },
    [accessToken, refresh],
  );

  return { deleteSubtitle, addSubtitle, useSubtitleLoading, useSubtitleError };
}
