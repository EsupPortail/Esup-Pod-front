import { useState, useCallback } from "react";
import type { Discipline } from "@/src/types";
import { useAuth } from "../context/AuthProvider";
import { getRoutes } from "../api/routes";
import { fetchAllPages } from "../api/fetchAllPages";

export function useDiscipline() {
  const { accessToken, refresh } = useAuth();
  const [discipline, setDiscipline] = useState<Discipline[]>([]);
  const [useDisciplineLoading, setUseDisciplineLoading] = useState(false);
  const [useDisciplineError, setUseDisciplineError] = useState<string | null>(
    null,
  );

  const fetchAll = useCallback(async () => {
    setUseDisciplineLoading(true);
    setUseDisciplineError(null);
    try {
      const normalizedDisciplines = await fetchAllPages<Discipline>(
        getRoutes().discipline.list,
        {
          accessToken,
          onRefresh: refresh,
        },
      );
      setDiscipline(normalizedDisciplines);
      return normalizedDisciplines;
    } catch (e: unknown) {
      setUseDisciplineError(
        e instanceof Error ? e.message : "Erreur de chargement.",
      );
      return [];
    } finally {
      setUseDisciplineLoading(false);
    }
  }, [accessToken, refresh]);

  return { discipline, fetchAll, useDisciplineLoading, useDisciplineError };
}
