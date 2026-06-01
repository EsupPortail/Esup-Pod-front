export type TimeParts = {
  hours: number;
  minutes: number;
  seconds: number;
};

export function secondToMinute(totalSeconds: number): TimeParts {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

export function formatTime(time: TimeParts): string {
  const { hours, minutes, seconds } = time;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

export function formatDateWithTime(dateString: string): string {
  const date = new Date(dateString);
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  return `${dateFormatter.format(date)} à ${timeFormatter.format(date)}`;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "Ajoutée à l'instant";
  } else if (minutes < 60) {
    return `Ajoutée il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (hours < 24) {
    return `Ajoutée il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  } else if (days < 7) {
    return `Ajoutée il y a ${days} jour${days > 1 ? "s" : ""}`;
  } else if (weeks < 4) {
    return `Ajoutée il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  } else if (months < 12) {
    return `Ajoutée il y a ${months} mois`;
  }

  return `Ajoutée il y a ${years} an${years > 1 ? "s" : ""}`;
}
