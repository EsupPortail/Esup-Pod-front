import { formatTime, secondToMinute, timeAgo } from "@/src/constants/date";
import type { Video } from "@/src/types/interface";
import type { VideoDisplayRow } from "./types";

/**
 * Convertit un objet Video envoyé par l’API en objet prêt pour l’affichage.
 */
export function mapVideoToDisplayRow(
  video: Video,
  currentUserId?: number,
): VideoDisplayRow {
  const isOwner = currentUserId != null && video.owner_id === currentUserId;

  return {
    id: String(video.id),
    video,
    slug: video.slug,
    title: video.title,
    thumbnailUrl: video.thumbnail_url || "/default_thumbnail.svg",
    durationLabel: formatTime(secondToMinute(video.duration || 0)),
    createdAtLabel: timeAgo(video.created_at),
    createdAtValue: video.created_at,
    owner: video.owner,
    ownerId: video.owner_id,
    isOwner,
    status: video.status,
    statusLabel: video.status_label || video.status,
    statusEncoding: video.encoding_status || "",
    hasPassword: video.has_password,
    isRestricted: video.status === "DR",
    href: `/video/${video.slug}`,
    editHref: `/video/edit/${video.slug}`,
    deleteHref: `/video/delete/${video.slug}`,
  };
}

export function mapVideosToDisplayRows(
  videos: Video[],
  currentUserId?: number,
): VideoDisplayRow[] {
  return videos.map((video) => mapVideoToDisplayRow(video, currentUserId));
}
