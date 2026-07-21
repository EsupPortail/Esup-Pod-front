import { useState, useCallback } from "react";
import type { User } from "@/src/types";
import { useAuth } from "../context/AuthProvider";
import { authFetch } from "../api/authFetch";
import { getRoutes } from "../api/routes";
import { requestJson } from "../utils/requestJson";

export function useUsers() {
  const { accessToken, refresh } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();
  const [useUserLoading, setUseUserLoading] = useState(false);
  const [useUserError, setUseUserError] = useState<string | null>(null);

  const fetchAll = useCallback(async (search?: string) => {
    setUseUserLoading(true);
    setUseUserError(null);
    try {
      const url = new URL(getRoutes().user.list);
      if (search) {
        url.searchParams.set("search", search);
      }
      const res = await authFetch(url.toString(), {
        accessToken,
        onRefresh: refresh,
      });
      const data = await requestJson<User[] | { results?: User[] }>(res);
      const normalizedUsers = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      setUsers(normalizedUsers);
      return normalizedUsers;
    } catch (e: unknown) {
      setUseUserError(e instanceof Error ? e.message : "Erreur de chargement.");
      return [];
    } finally {
      setUseUserLoading(false);
    }
  }, [accessToken, refresh]);

  const fetchUser = useCallback(
    async (id: number) => {
      setUseUserLoading(true);
      setUseUserError(null);
      try {
        const res = await authFetch(getRoutes().user.get(id), {
          accessToken,
          onRefresh: refresh,
        });
        const data = await requestJson<User>(res);
        setUser(data);
        return data;
      } catch (e: unknown) {
        setUseUserError(
          e instanceof Error ? e.message : "Erreur de chargement.",
        );
        return null;
      } finally {
        setUseUserLoading(false);
      }
    },
    [accessToken, refresh],
  );

  return { users, user, fetchAll, fetchUser, useUserLoading, useUserError };
}
