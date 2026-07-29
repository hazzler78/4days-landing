/**
 * Tracks whether the visitor has completed the city-build scroll once.
 * Returning visitors see the completed future city instead of construction.
 */
export const VISIT_STORAGE_KEY = "4days_city_visit";

export type VisitMode = "first" | "returning";

export function readVisitMode(): VisitMode {
  if (typeof window === "undefined") return "first";
  try {
    const value = window.localStorage.getItem(VISIT_STORAGE_KEY);
    if (value === "returning") return "returning";
  } catch {
    /* private mode / blocked storage */
  }
  return "first";
}

/** Mark visitor as returning after they finish the first-visit city scrub. */
export function markReturningVisit(): void {
  try {
    window.localStorage.setItem(VISIT_STORAGE_KEY, "returning");
  } catch {
    /* ignore */
  }
}

/** Dev/debug helper — reset to first-visit experience. */
export function resetVisitMode(): void {
  try {
    window.localStorage.removeItem(VISIT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
