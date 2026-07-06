export type CollectionOrder = "-created_at" | "created_at" | "title" | "-title";

export const PLAYLIST_ORDER_OPTIONS = [
  { label: "Plus récentes", value: "created_at" },
  { label: "Plus anciennes", value: "-created_at" },
  { label: "A-Z", value: "title" },
  { label: "Z-A", value: "-title" },
] satisfies Array<{
  label: string;
  value: CollectionOrder;
}>;
