"use client";
import { useEffect, useState } from "react";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { AppInfo } from "@/src/types";
import { useTranslation } from "./useTranslation";

/** Loads and exposes the backend application information. */
export function useAppInfo() {
  const [info, setInfo] = useState<AppInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    /** Fetches application information from the backend. */
    const fetchInfo = async () => {
      try {
        const data = await requestJson<AppInfo>(getRoutes().info.get);
        setInfo(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t("errors.loadInfo"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  return { info, loading, error };
}
