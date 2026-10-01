import { useState, useCallback } from "react";
import { LanguageSubtitle } from "@/src/constants/language";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { getRoutes } from "../api/routes";
import { useTranslation } from "./useTranslation";

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
  const { t } = useTranslation();

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
          throw new Error(t("errors.deleteSubtitleError"));
        }

        return true;
      } catch (e: unknown) {
        setUseSubtitleError(
          e instanceof Error
            ? e.message
            : t("errors.deleteSubtitleError"),
        );
        return false;
      } finally {
        setUseSubtitleLoading(false);
      }
    },
    [accessToken, refresh, t],
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
          throw new Error(t("errors.addSubtitleError"));
        }

        return true;
      } catch (e: unknown) {
        setUseSubtitleError(
          e instanceof Error
            ? e.message
            : t("errors.addSubtitleError"),
        );
        return false;
      } finally {
        setUseSubtitleLoading(false);
      }
    },
    [accessToken, refresh, t],
  );

  return { deleteSubtitle, addSubtitle, useSubtitleLoading, useSubtitleError };
}
