import { useState, useCallback } from "react";
import type { Type } from "@/src/types";
import { useAuth } from "../context/AuthProvider";
import { getRoutes } from "../api/routes";
import { fetchAllPages } from "../api/fetchAllPages";

export function useTypes() {
  const { accessToken, refresh } = useAuth();
  const [types, setTypes] = useState<Type[]>([]);
  const [useTypesLoading, setUseTypesLoading] = useState(false);
  const [useTypesError, setUseTypesError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setUseTypesLoading(true);
    setUseTypesError(null);
    try {
      const normalizedTypes = await fetchAllPages<Type>(getRoutes().types.list, {
        accessToken,
        onRefresh: refresh,
      });
      setTypes(normalizedTypes);
      return normalizedTypes;
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
