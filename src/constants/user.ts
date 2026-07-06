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

export function getUserDisplayName(user: User): string {
  const lastName = user.last_name?.trim() ?? "";
  const firstName = user.first_name?.trim() ?? "";

  if (lastName || firstName) {
    return `${lastName} ${firstName}`.trim();
  }

  return user.username;
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
