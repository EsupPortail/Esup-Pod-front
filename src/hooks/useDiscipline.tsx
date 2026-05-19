import { useState, useCallback } from "react";
import { Discipline } from "../types/interface";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { getRoutes } from "../api/routes";
import { requestJson } from "../utils/requestJson";

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
      const res = await authFetch(getRoutes().discipline.list, {
        accessToken,
        onRefresh: refresh,
      });
      const data = await requestJson<Discipline[]>(res);
      setDiscipline(data);
      return data;
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
