/**
 * City visual assets — swap high-quality media here without touching CityHero overlay/CTA.
 *
 * VIDEO SWAP:
 * 1. Replace files under /public/video/ (keep names) OR update paths below.
 * 2. Prefer .webm + .mp4 dual sources; posters as .webp (or .avif).
 * 3. Source can be 4K; deliver web-optimized (H.264/AV1, reasonable bitrate).
 *
 * GLB SWAP (future interactive city):
 * 1. Place models in /public/3d/city-build.glb and city-complete.glb
 * 2. Set useGlbCity: true — ScrollCity will prefer R3F model scrub over video.
 * See /public/3d/README.md for details.
 */
export const CITY_ASSETS = {
  /** When true, prefer GLB city models over video scrub (requires files in /public/3d/). */
  useGlbCity: false,

  firstVisit: {
    video: "/video/city-build.mp4",
    videoWebm: "/video/city-build.webm",
    poster: "/video/posters/city-build.jpg",
    glb: "/3d/city-build.glb",
  },

  returning: {
    video: "/video/city-complete.mp4",
    videoWebm: "/video/city-complete.webm",
    poster: "/video/posters/city-complete.jpg",
    glb: "/3d/city-complete.glb",
  },
} as const;

export type CityVisitMode = "first" | "returning";

export function getCityAssets(mode: CityVisitMode) {
  return mode === "returning" ? CITY_ASSETS.returning : CITY_ASSETS.firstVisit;
}
