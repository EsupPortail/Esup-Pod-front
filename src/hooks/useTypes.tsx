import { useState, useCallback } from "react";
import type { Type } from "@/src/types";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { getRoutes } from "../api/routes";
import { requestJson } from "../utils/requestJson";

export function useTypes() {
  const { accessToken, refresh } = useAuth();
  const [types, setTypes] = useState<Type[]>([]);
  const [useTypesLoading, setUseTypesLoading] = useState(false);
  const [useTypesError, setUseTypesError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setUseTypesLoading(true);
    setUseTypesError(null);
    try {
      const res = await authFetch(getRoutes().types.list, {
        accessToken,
        onRefresh: refresh,
      });
      const data = await requestJson<Type[]>(res);
      setTypes(data);
      return data;
    } catch (e: unknown) {
      setUseTypesError(
        e instanceof Error ? e.message : "Erreur de chargement.",
      );
      return [];
    } finally {
      setUseTypesLoading(false);
    }
  }, [accessToken, refresh]);

  return { types, fetchAll, useTypesLoading, useTypesError };
}
