// src/hooks/useAuthGuard.ts
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthProvider";

export function useRequireAuth(redirectTo = "/login") {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const hasRedirectedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isInitializing || hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    if (!isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(
        `${redirectTo}?reason=auth&redirect=${encodeURIComponent(currentPath)}`,
      );
    }
  }, [isAuthenticated, isInitializing, router, redirectTo]);

  return { isAuthenticated, isInitializing, mounted };
}
