"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getRoutes } from "@/src/api/routes";
import { requestJson } from "@/src/utils/requestJson";
import type { AppConfig } from "@/src/types";

interface AppConfigContextType {
  config: AppConfig | null;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

const AppConfigContext = createContext<AppConfigContextType>({
  config: null,
  loading: true,
  error: null,
  refreshConfig: async () => {},
});

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const data = await requestJson<AppConfig>(getRoutes().conf.get);
      setConfig(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur de chargement de la configuration.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <AppConfigContext.Provider
      value={{
        config,
        loading,
        error,
        refreshConfig: fetchConfig,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfigContext() {
  return useContext(AppConfigContext);
}
