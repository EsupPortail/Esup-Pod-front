"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import type { SupportedLocale } from "@/src/locales";

const LANGUAGE_COOKIE = "pod_language";

const supportedLocales: { code: SupportedLocale; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

/** Provides translations and locale selection for client components. */
export function useTranslation() {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations();
  const router = useRouter();

  /** Persists a new locale and refreshes server-rendered messages. */
  const setLocale = (newLocale: SupportedLocale) => {
    document.cookie = `${LANGUAGE_COOKIE}=${newLocale}; path=/; max-age=31536000`;
    dayjs.locale(newLocale);
    router.refresh();
  };

  return { locale, setLocale, t, supportedLocales };
}
