import type { User } from "@/src/types";

export function setInitial(lastname: string, firstname: string) {
  return lastname
    .concat(" ", firstname)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getUserDisplayName(
  user: User,
  config?: { hide_username?: boolean; use_establishment_field?: boolean },
  isPublicView = false
): string {
  if (config?.hide_username && isPublicView) {
    return "Anonyme";
  }

  if (config?.use_establishment_field && user.establishment?.trim()) {
    return user.establishment.trim();
  }

  const lastName = user.last_name?.trim() ?? "";
  const firstName = user.first_name?.trim() ?? "";

  if (lastName || firstName) {
    return `${lastName} ${firstName}`.trim();
  }

  return user.username;
}

export function getVideoOwnerDisplayName(
  video: { owner_last_name?: string; owner_first_name?: string; owner?: string },
  config?: { hide_username?: boolean; use_establishment_field?: boolean },
  isPublicView = false
): string {
  if (config?.hide_username && isPublicView) {
    return "Anonyme";
  }

  const lastName = video.owner_last_name?.trim() ?? "";
  const firstName = video.owner_first_name?.trim() ?? "";

  if (lastName || firstName) {
    return `${lastName} ${firstName}`.trim();
  }

  return video.owner || "";
}

export function getProfilePictureUrl(
  picture?: string | null,
): string | undefined {
  if (!picture) {
    return undefined;
  }

  if (picture.startsWith("http")) {
    return picture;
  }

  const backUrl = process.env.NEXT_PUBLIC_BACK_URL ?? "";
  const sanitizedBackUrl = backUrl.replace(/\/$/, "");
  const sanitizedPicture = picture.replace(/^\//, "");

  return `${sanitizedBackUrl}/${sanitizedPicture}`;
}
