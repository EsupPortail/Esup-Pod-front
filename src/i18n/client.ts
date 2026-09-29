const LANGUAGE_COOKIE = "pod_language";
const DEFAULT_LOCALE = "fr";
const SUPPORTED_LOCALES = new Set(["fr", "en", "es"]);

export function getClientLocale(): string {
  if (typeof document === "undefined") {
    return DEFAULT_LOCALE;
  }

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${LANGUAGE_COOKIE}=`));
  const locale = cookie?.split("=")[1];

  return locale && SUPPORTED_LOCALES.has(locale) ? locale : DEFAULT_LOCALE;
}
