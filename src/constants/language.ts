/* Video Language*/
export type LanguageCode = "en" | "fr";

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  fr: "Français",
};

export const VIDEO_LANGUAGE_OPTIONS = [
  { label: "Français", value: "fr" },
  { label: "English", value: "en" },
] as const;

/** Returns the display label for a video language code. */
export const getLanguageLabel = (code: string | null | undefined) => {
  if (!code) {
    return LANGUAGE_LABELS["fr"];
  }
  return LANGUAGE_LABELS[code as LanguageCode] ?? LANGUAGE_LABELS["fr"];
};

/*Subtitles*/
export type LanguageSubtitle = "fr" | "en" | "es" | "de";

export const SUBTITLE_LANGUAGE_OPTIONS: Array<{
  label: string;
  value: LanguageSubtitle;
}> = [
  { label: "Français", value: "fr" },
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "Deutsch", value: "de" },
];
