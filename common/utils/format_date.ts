import TimeAgo, { FormatStyleName } from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

export const _timeAgo = new TimeAgo("en-US");
export default function formatDate(
  date: Date,
  format?: FormatStyleName
): string;
export default function formatDate(
  timeStamp: number,
  format?: FormatStyleName
): string;
export default function formatDate(
  date: Date | number,
  format?: FormatStyleName
) {
  if (typeof date == "number") date = new Date(date);
  return format
    ? _timeAgo.format(date, format)
    : date.getTime() > date.getTime() - 24 * 60 * 60 * 7
    ? date.toLocaleString()
    : _timeAgo.format(date, "round-minute");
}
