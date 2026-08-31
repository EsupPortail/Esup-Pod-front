import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import "dayjs/locale/en";
import "dayjs/locale/es";

dayjs.extend(relativeTime);

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

export function formatDateWithTime(dateString: string, locale: string = "fr"): string {
  const date = dayjs(dateString).locale(locale);
  return date.format("D MMMM YYYY [à] HH:mm");
}

export function formatDateOnly(dateString: string, locale: string = "fr"): string {
  const date = dayjs(dateString).locale(locale);
  return date.format("D MMMM YYYY");
}

export function timeAgo(dateString: string, locale: string = "fr"): string {
  if (!dateString) return "";
  return dayjs(dateString).locale(locale).fromNow();
}
