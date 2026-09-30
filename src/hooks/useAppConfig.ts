"use client";

import { useAppConfigContext } from "@/src/context/AppConfigProvider";

/** Returns the application configuration context. */
export function useAppConfig() {
  const context = useAppConfigContext();
  return context;
}
