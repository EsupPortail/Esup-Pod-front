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

/** Converts a number of seconds into hour, minute, and second parts. */
export function secondToMinute(totalSeconds: number): TimeParts {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

/** Formats time parts as a fixed-width duration. */
export function formatTime(time: TimeParts): string {
  const { hours, minutes, seconds } = time;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

/** Formats a date with its time in the requested locale. */
export function formatDateWithTime(
  dateString: string,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(dateString));
}

/** Formats a date without its time in the requested locale. */
export function formatDateOnly(
  dateString: string,
  locale: string,
): string {
  const date = dayjs(dateString).locale(locale);
  return date.format("D MMMM YYYY");
}

/** Formats a date as relative time in the requested locale. */
export function timeAgo(dateString: string, locale: string): string {
  if (!dateString) return "";
  return dayjs(dateString).locale(locale).fromNow();
}
