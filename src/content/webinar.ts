import { siteConfig } from "@/lib/site";

/**
 * Webbinarium "Kom igång med SI-agenter".
 *
 * Datum läggs in här, och bara här. Sidan /webbinar, knappen
 * "Lägg till i kalendern" och /webbinar/nasta.ics läser samma lista.
 *
 * Lägg till ett tillfälle i `webinarSessions`:
 *
 * {
 *   start: "YYYY-MM-DDTHH:mm:ss+01:00", // vintertid, CET
 *   end: "YYYY-MM-DDTHH:mm:ss+01:00",
 * }
 *
 * Sommartid (CEST) använder offset +02:00. Skriv alltid offset eller Z.
 * En tid utan tidszon hoppas över, så att den inte tolkas som UTC av misstag.
 *
 * Nästa tillfälle är det första som inte har slutat. Tider visas och
 * sparas i kalendern som Europe/Stockholm. Lämna listan tom tills ett
 * datum är bestämt.
 */
export type WebinarSession = {
  /** ISO 8601, med offset eller Z. */
  start: string;
  /** ISO 8601, med offset eller Z. Måste vara efter start. */
  end: string;
};

export const webinarSessions: WebinarSession[] = [];

export const webinarTimeZone = "Europe/Stockholm";

export const webinarPath = "/webbinar";

export const webinarIcsPath = "/webbinar/nasta.ics";

export const webinarZoomUrl =
  "https://us06web.zoom.us/j/6621000255?pwd=d8zXlw74UEbp62B1Nz0v7zdx1hxKEY.1";

export const webinarEventTitle =
  "Webbinar: Kom igång med SI-agenter (4days.ai)";

/** Join button is primary from 15 minutes before start until the session ends. */
export const WEBINAR_JOIN_LEAD_MS = 15 * 60 * 1000;

export type JoinPhase = "live" | "soon" | "later" | "none";

const ZONE_SUFFIX = /(?:Z|[+-]\d{2}:\d{2})$/;

export function webinarCalendarDescription(): string {
  return [
    "Kom igång med SI-agenter (superintelligens), live med 4days.ai.",
    "",
    `Gå med i webbinaret: ${webinarZoomUrl}`,
    "",
    siteConfig.slogan,
  ].join("\n");
}

function parseSession(session: WebinarSession): { start: Date; end: Date } | null {
  const startRaw = session.start?.trim() ?? "";
  const endRaw = session.end?.trim() ?? "";
  if (!ZONE_SUFFIX.test(startRaw) || !ZONE_SUFFIX.test(endRaw)) return null;
  const start = new Date(startRaw);
  const end = new Date(endRaw);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  if (end.getTime() <= start.getTime()) return null;
  return { start, end };
}

export function invalidWebinarSessions(
  sessions: readonly WebinarSession[] = webinarSessions
): WebinarSession[] {
  return sessions.filter((session) => !parseSession(session));
}

/** Earliest session that has not ended yet. A live session stays "next". */
export function getNextSession(
  now: Date = new Date(),
  sessions: readonly WebinarSession[] = webinarSessions
): WebinarSession | null {
  const nowMs = now.getTime();
  const upcoming = sessions
    .map((session) => ({ session, parsed: parseSession(session) }))
    .filter(
      (item): item is { session: WebinarSession; parsed: { start: Date; end: Date } } =>
        item.parsed !== null && item.parsed.end.getTime() > nowMs
    )
    .sort((a, b) => a.parsed.start.getTime() - b.parsed.start.getTime());
  return upcoming[0]?.session ?? null;
}

export function joinPhase(
  session: WebinarSession | null,
  now: Date = new Date()
): JoinPhase {
  if (!session) return "none";
  const parsed = parseSession(session);
  if (!parsed) return "none";
  const t = now.getTime();
  if (t > parsed.end.getTime()) return "later";
  if (t >= parsed.start.getTime()) return "live";
  if (t >= parsed.start.getTime() - WEBINAR_JOIN_LEAD_MS) return "soon";
  return "later";
}

function cleanSpaces(value: string): string {
  return value.replace(/[\u00a0\u202f]/g, " ");
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** "Onsdag 3 december 2026, kl. 12:00–13:00" in Europe/Stockholm. */
export function formatSessionWhen(session: WebinarSession): string {
  const start = new Date(session.start);
  const end = new Date(session.end);
  const dateFmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: webinarTimeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: webinarTimeZone,
    hour: "2-digit",
    minute: "2-digit",
  });
  const startDate = capitalize(cleanSpaces(dateFmt.format(start)));
  const endDate = capitalize(cleanSpaces(dateFmt.format(end)));
  const startTime = cleanSpaces(timeFmt.format(start));
  const endTime = cleanSpaces(timeFmt.format(end));
  if (startDate === endDate) {
    return `${startDate}, kl. ${startTime}–${endTime}`;
  }
  return `${startDate}, kl. ${startTime} – ${endDate}, kl. ${endTime}`;
}

export function toUtcBasic(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function toZonedBasic(iso: string, timeZone = webinarTimeZone): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  let hour = get("hour");
  if (hour === "24") hour = "00";
  return `${get("year")}${get("month")}${get("day")}T${hour}${get("minute")}${get("second")}`;
}

export function googleCalendarUrl(session: WebinarSession): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: webinarEventTitle,
    dates: `${toUtcBasic(session.start)}/${toUtcBasic(session.end)}`,
    details: webinarCalendarDescription(),
    location: webinarZoomUrl,
    ctz: webinarTimeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
