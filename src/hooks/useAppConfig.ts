"use client";

import { useAppConfigContext } from "@/src/context/AppConfigProvider";

export function useAppConfig() {
  const context = useAppConfigContext();
  return context;
}
