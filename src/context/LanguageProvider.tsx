"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/en";
import "dayjs/locale/es";
import { dictionaries, SupportedLocale } from "@/src/locales";

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (
    key: string,
    paramsOrFallback?: Record<string, string | number> | string,
    fallback?: string
  ) => string;
  supportedLocales: { code: SupportedLocale; label: string }[];
}

const STORAGE_KEY = "pod_language";

const supportedLocales: { code: SupportedLocale; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

const LanguageContext = createContext<LanguageContextType>({
  locale: "fr",
  setLocale: () => {},
  t: (key) => key,
  supportedLocales,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("fr");

  useEffect(() => {
    // Read stored language from localStorage or Cookie
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY) as SupportedLocale;
      if (stored && dictionaries[stored]) {
        setLocaleState(stored);
        dayjs.locale(stored);
      } else {
        setLocaleState("fr");
        dayjs.locale("fr");
      }
    }
  }, []);

  const changeLocale = useCallback((newLocale: SupportedLocale) => {
    if (!dictionaries[newLocale]) return;
    setLocaleState(newLocale);
    dayjs.locale(newLocale);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.cookie = `${STORAGE_KEY}=${newLocale}; path=/; max-age=31536000`;
    }
  }, []);

  const t = useCallback(
    (
      key: string,
      paramsOrFallback?: Record<string, string | number> | string,
      fallback?: string
    ): string => {
      let params: Record<string, string | number> | undefined;
      let defaultText: string | undefined = fallback;

      if (typeof paramsOrFallback === "string") {
        defaultText = paramsOrFallback;
      } else if (paramsOrFallback && typeof paramsOrFallback === "object") {
        params = paramsOrFallback;
      }

      const dictionary = dictionaries[locale] || dictionaries["fr"];
      const keys = key.split(".");
      let value: any = dictionary;
      let found = true;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          found = false;
          break;
        }
      }

      if (!found || typeof value !== "string") {
        // Fallback to French if key not found in current locale
        let fallbackVal: any = dictionaries["fr"];
        let foundInFr = true;
        for (const fk of keys) {
          if (fallbackVal && typeof fallbackVal === "object" && fk in fallbackVal) {
            fallbackVal = fallbackVal[fk];
          } else {
            foundInFr = false;
            break;
          }
        }
        if (foundInFr && typeof fallbackVal === "string") {
          value = fallbackVal;
        } else {
          return defaultText || key;
        }
      }

      if (params) {
        Object.entries(params).forEach(([pKey, pVal]) => {
          const escapedKey = pKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          value = value.replace(new RegExp(`\\{${escapedKey}\\}`, "g"), String(pVal));
        });
      }

      return value;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale: changeLocale,
        t,
        supportedLocales,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
