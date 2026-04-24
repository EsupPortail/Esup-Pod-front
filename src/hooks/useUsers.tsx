import { useState, useCallback } from "react";
import { User } from "../types/interface";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { getRoutes } from "../api/routes";
import { requestJson } from "../utils/requestJson";

export function useUsers() {
  const { accessToken, refresh } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [useUserLoading, setUseUserLoading] = useState(false);
  const [useUserError, setUseUserError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setUseUserLoading(true);
    setUseUserError(null);
    try {
      const res = await authFetch(getRoutes().user.list, {
        accessToken,
        onRefresh: refresh,
      });
      const data = await requestJson<User[]>(res);
      console.log(data);
      setUsers(data);
      console.log(data);
      return data;
    } catch (e: unknown) {
      setUseUserError(e instanceof Error ? e.message : "Erreur de chargement.");
      return [];
    } finally {
      setUseUserLoading(false);
    }
  }, [accessToken, refresh]);

  return { users, fetchAll, useUserLoading, useUserError };
}
