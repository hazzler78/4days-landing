import {
  toUtcBasic,
  toZonedBasic,
  webinarCalendarDescription,
  webinarEventTitle,
  webinarTimeZone,
  webinarZoomUrl,
  type WebinarSession,
} from "@/content/webinar";
import { siteConfig } from "@/lib/site";

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Stockholm",
  "X-LIC-LOCATION:Europe/Stockholm",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
].join("\r\n");

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\n|\r/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

/** Fold at 75 octets, continuation lines start with a space (RFC 5545). */
export function foldIcsLine(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const decoder = new TextDecoder();
  const parts: string[] = [];
  let start = 0;
  let first = true;
  while (start < bytes.length) {
    const limit = first ? 75 : 74;
    let end = Math.min(start + limit, bytes.length);
    while (end > start && (bytes[end] & 0xc0) === 0x80) end -= 1;
    if (end === start) end = Math.min(start + limit, bytes.length);
    const chunk = decoder.decode(bytes.subarray(start, end));
    parts.push(first ? chunk : ` ${chunk}`);
    first = false;
    start = end;
  }
  return parts.join("\r\n");
}

function line(name: string, value: string): string {
  return foldIcsLine(`${name}:${escapeText(value)}`);
}

export function buildWebinarIcs(session: WebinarSession, now: Date = new Date()): string {
  const uid = `webbinar-${toUtcBasic(session.start)}@4days.ai`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//4days.ai//Webbinar//SV",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-TIMEZONE:${webinarTimeZone}`,
    VTIMEZONE,
    "BEGIN:VEVENT",
    line("UID", uid),
    `DTSTAMP:${toUtcBasic(now.toISOString())}`,
    `DTSTART;TZID=${webinarTimeZone}:${toZonedBasic(session.start)}`,
    `DTEND;TZID=${webinarTimeZone}:${toZonedBasic(session.end)}`,
    line("SUMMARY", webinarEventTitle),
    line("DESCRIPTION", webinarCalendarDescription()),
    line("LOCATION", webinarZoomUrl),
    line("URL", webinarZoomUrl),
    `ORGANIZER;CN=4days.ai:MAILTO:${siteConfig.email}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.join("\r\n")}\r\n`;
}
