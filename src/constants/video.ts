export type VideoStatus = "DR" | "PU" | "RE" | "EN" | "ER";
export type VideoEncodingStatus = "PE" | "PR" | "DO" | "ER";

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
  { label: "Privée", value: "DR" },
  { label: "Publique", value: "PU" },
  { label: "Accès restreint", value: "RE" },
] satisfies Array<{
  label: string;
  value: VideoStatus;
}>;

export const VIDEO_ENCODING_STATUS_OPTIONS = [
  { label: "En attente", value: "PE" },
  { label: "En cours", value: "PR" },
  { label: "Terminé", value: "DO" },
  { label: "Erreur", value: "ER" },
] satisfies Array<{
  label: string;
  value: VideoEncodingStatus;
}>;
