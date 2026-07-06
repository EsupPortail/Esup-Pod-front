export function capitalize(value: string) {
  return value.length ? value[0].toUpperCase() + value.slice(1) : value;
}

export function truncateVideoTitle(value?: string | null, maxLength = 18) {
  if (!value) return "";
  if (value.length > maxLength) return value.slice(0, maxLength) + "...";
  return value;
}
