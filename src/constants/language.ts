/* Video Language*/
export type LanguageCode = "en-en" | "fr-fr" | "es-es";

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  "en-en": "Anglais",
  "fr-fr": "Français",
  "es-es": "Espagnol",
};

export const VIDEO_LANGUAGE_OPTIONS = [
  { label: "Français", value: "fr-fr" },
  { label: "Anglais", value: "en-en" },
  { label: "Espagnol", value: "es-es" },
] as const;

export const getLanguageLabel = (code: string | null | undefined) => {
  if (!code) {
    return LANGUAGE_LABELS["fr-fr"];
  }
  return LANGUAGE_LABELS[code as LanguageCode] ?? LANGUAGE_LABELS["fr-fr"];
};

/*Subtitles*/
export type LanguageSubtitle = "fr" | "en" | "es";

export const SUBTITLE_LANGUAGE_OPTIONS: Array<{
  label: string;
  value: LanguageSubtitle;
}> = [
  { label: "Français", value: "fr" },
  { label: "Anglais", value: "en" },
  { label: "Espagnol", value: "es" },
];
