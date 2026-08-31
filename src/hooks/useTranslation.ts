"use client";

import { useLanguage } from "@/src/context/LanguageProvider";

export function useTranslation() {
  const { locale, setLocale, t, supportedLocales } = useLanguage();
  return { locale, setLocale, t, supportedLocales };
}
