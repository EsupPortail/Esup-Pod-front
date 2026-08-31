export type CursusCode = "L1" | "L2" | "L3" | "M1" | "M2" | "D" | "0";

export const CURSUS_CODES: CursusCode[] = ["L1", "L2", "L3", "M1", "M2", "D", "0"];

export const CURSUS_LABELS: Record<CursusCode, string> = {
  L1: "Licence 1",
  L2: "Licence 2",
  L3: "Licence 3",
  M1: "Master 1",
  M2: "Master 2",
  D: "Doctorate",
  0: "Other",
};

export const getCursusOptions = (t?: (key: string) => string) => {
  return CURSUS_CODES.map((code) => ({
    value: code,
    label: t ? t(`cursus.${code}`) : CURSUS_LABELS[code],
  }));
};

export const CURSUS_OPTIONS = getCursusOptions();

export const getCursusLabel = (
  code: string | null | undefined,
  t?: (key: string) => string
) => {
  if (!code) {
    return t ? t("cursus.0") : CURSUS_LABELS["0"];
  }

  const validCode = (CURSUS_CODES.includes(code as CursusCode)
    ? code
    : "0") as CursusCode;

  return t ? t(`cursus.${validCode}`) : (CURSUS_LABELS[validCode] ?? CURSUS_LABELS["0"]);
};
