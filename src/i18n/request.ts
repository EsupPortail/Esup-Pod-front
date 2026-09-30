import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { dictionaries, type SupportedLocale } from "@/src/locales";

const LANGUAGE_COOKIE = "pod_language";

/** Checks whether a cookie value is an application locale. */
function isSupportedLocale(value: string | undefined): value is SupportedLocale {
  return value === "fr" || value === "en" || value === "es";
}

/** Loads the request locale and matching messages from the language cookie. */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LANGUAGE_COOKIE)?.value;
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : "fr";

  return {
    locale,
    messages: dictionaries[locale],
  };
});
