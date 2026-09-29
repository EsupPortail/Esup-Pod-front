import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { dictionaries, type SupportedLocale } from "@/src/locales";

const LANGUAGE_COOKIE = "pod_language";

function isSupportedLocale(value: string | undefined): value is SupportedLocale {
  return value === "fr" || value === "en" || value === "es";
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LANGUAGE_COOKIE)?.value;
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : "fr";

  return {
    locale,
    messages: dictionaries[locale],
  };
});
