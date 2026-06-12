"use client";
import { useEffect, useState } from "react";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { AppConfig } from "@/src/types";

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await requestJson<AppConfig>(getRoutes().conf.get);
        setConfig(data);
      } catch (err: any) {
        setError(err?.message ?? "Erreur de chargement de la configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
}
