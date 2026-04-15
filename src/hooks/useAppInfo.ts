"use client";
import { useEffect, useState } from "react";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { AppInfo } from "@/src/types/interface";

export function useAppInfo() {
  const [info, setInfo] = useState<AppInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await requestJson<AppInfo>(getRoutes().info.get);
        setInfo(data);
      } catch (err: any) {
        setError(err?.message ?? "Erreur de chargement des informations.");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  return { info, loading, error };
}
