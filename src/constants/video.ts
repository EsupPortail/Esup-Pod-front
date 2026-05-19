export type VideoStatus = "DR" | "PU" | "RE" | "EN" | "ER";

export type VideoLicense =
  | "CC-BY"
  | "CC-BY-SA"
  | "CC-BY-NC"
  | "CC-BY-ND"
  | "COPYRIGHT"
  | ""
  | null;

export const DEFAULT_VIDEO_LICENSE_OPTIONS = [
  "CC-BY",
  "CC-BY-SA",
  "CC-BY-NC",
  "CC-BY-ND",
  "COPYRIGHT",
] as const;

export const VIDEO_STATUS_OPTIONS = [
  { label: "Privée", value: "DR", disabled: false },
  { label: "Publique", value: "PU", disabled: false },
  { label: "Accès restreint", value: "RE", disabled: false },
  { label: "Encodage en cours", value: "EN", disabled: true },
  { label: "Erreur d'encodage", value: "ER", disabled: true },
] satisfies Array<{
  label: string;
  value: VideoStatus;
  disabled: boolean;
}>;
