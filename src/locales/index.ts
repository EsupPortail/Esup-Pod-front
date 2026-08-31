import { fr } from "./fr";
import { en } from "./en";
import { es } from "./es";

export const dictionaries = { fr, en, es };
export type SupportedLocale = keyof typeof dictionaries;
export * from "./fr";
