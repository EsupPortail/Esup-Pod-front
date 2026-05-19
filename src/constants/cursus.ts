export type CursusCode = "L1" | "L2" | "L3" | "M1" | "M2" | "D" | "0";

export const CURSUS_LABELS: Record<CursusCode, string> = {
  L1: "Licence 1",
  L2: "Licence 2",
  L3: "Licence 3",
  M1: "Master 1",
  M2: "Master 2",
  D: "Doctorate",
  0: "Other",
};

export const CURSUS_OPTIONS = Object.entries(CURSUS_LABELS).map(
  ([value, label]) => ({
    value: value as CursusCode,
    label,
  }),
);

export const getCursusLabel = (code: string | null | undefined) => {
  if (!code) {
    return CURSUS_LABELS["0"];
  }

  return CURSUS_LABELS[code as CursusCode] ?? CURSUS_LABELS["0"];
};
