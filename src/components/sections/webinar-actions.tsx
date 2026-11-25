"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  joinPhase,
  webinarPath,
  type JoinPhase,
  type WebinarSession,
} from "@/content/webinar";

const remindHref = `${webinarPath}#paminnelse`;

const PHASE_LABEL: Record<JoinPhase, string | null> = {
  live: "Pågår nu",
  soon: "Börjar snart",
  later: null,
  none: null,
};

export function WebinarActions({
  zoomUrl,
  session,
  initialPhase,
  icsPath,
  googleCalendarUrl,
}: {
  zoomUrl: string;
  session: WebinarSession | null;
  initialPhase: JoinPhase;
  icsPath: string | null;
  googleCalendarUrl: string | null;
}) {
  const [phase, setPhase] = useState<JoinPhase>(initialPhase);

  useEffect(() => {
    const tick = () => setPhase(joinPhase(session, new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [session]);

  const emphasized = phase === "live" || phase === "soon";
  const status = PHASE_LABEL[phase];

  const join = (
    <Button
      asChild
      size="lg"
      variant={emphasized ? "default" : "secondary"}
      className="w-full sm:w-auto"
    >
      <a href={zoomUrl} target="_blank" rel="noopener noreferrer">
        <Video className="h-5 w-5" aria-hidden="true" />
        Gå med i webbinaret
        <span className="sr-only"> (öppnas i ny flik)</span>
      </a>
    </Button>
  );

  const remind = (
    <Button asChild size="lg" variant="default" className="w-full sm:w-auto">
      <a href={remindHref}>Påminn mig</a>
    </Button>
  );

  const calendar = icsPath ? (
    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
      <a href={icsPath}>
        <CalendarPlus className="h-5 w-5" aria-hidden="true" />
        Lägg till i kalendern
      </a>
    </Button>
  ) : null;

  return (
    <div className="mt-8">
      {status ? (
        <p
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent"
          aria-live="polite"
        >
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-accent"
            aria-hidden="true"
          />
          {status}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {emphasized ? (
          <>
            {join}
            {calendar}
            <a
              href={remindHref}
              className="inline-flex h-12 items-center justify-center px-2 text-sm font-semibold text-slate-200 underline-offset-2 hover:text-white hover:underline"
            >
              Påminn mig
            </a>
          </>
        ) : (
          <>
            {remind}
            {calendar}
            {join}
          </>
        )}
      </div>
      {googleCalendarUrl ? (
        <p className="mt-4 text-sm">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Lägg till i Google Kalender
            <span className="sr-only"> (öppnas i ny flik)</span>
          </a>
        </p>
      ) : null}
    </div>
  );
}
