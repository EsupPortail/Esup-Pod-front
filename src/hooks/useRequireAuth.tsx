"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthProvider";
import { useMounted } from "@/src/hooks/useMounted";

/* Verifie que le user est connecté et redirige vers la page login dans le cas contraire*/
export function useRequireAuth(redirectTo = "/login", enabled = true) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const hasRedirectedRef = useRef(false);
  const mounted = useMounted();

  useEffect(() => {
    if (!enabled || !mounted || isInitializing || hasRedirectedRef.current) {
      return;
    }
    hasRedirectedRef.current = true;
    if (!isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(
        `${redirectTo}?reason=auth&redirect=${encodeURIComponent(currentPath)}`,
      );
    }
  }, [enabled, mounted, isAuthenticated, isInitializing, router, redirectTo]);

  return { isAuthenticated, isInitializing, mounted };
}
