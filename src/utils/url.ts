const backUrl = (
  process.env.NEXT_PUBLIC_BACK_URL ?? "http://pod.localhost:8000/"
).replace(/\/$/, "");

export function getThumbnailUrl(path?: string | null): string {
  if (!path) return "/default_thumbnail.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${backUrl}/${path.replace(/^\//, "")}`;
}
