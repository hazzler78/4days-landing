# Video assets – city hero

Replace these files to upgrade visual quality without code changes
(or update paths in `src/lib/city-assets.ts`).

## Files

| Path | When shown |
|------|------------|
| `city-build.mp4` | First visit – construction / build sequence (scroll-scrubbed) |
| `city-complete.mp4` | Returning visit – finished future city |
| `posters/city-build.jpg` (or `.webp`) | Poster / reduced-motion fallback |
| `posters/city-complete.jpg` (or `.webp`) | Poster / reduced-motion fallback |

Optional: add `city-build.webm` and `city-complete.webm`, then uncomment the
`<source type="video/webm">` lines in `src/components/city/scroll-city.tsx`.

## Encoding tips (critical for smooth scroll-scrub)

Scroll-scrub seeks the video many times per second. That is **much harder**
than normal playback. Encode specifically for scrubbing:

```bash
# Example with ffmpeg — 1080p, frequent keyframes, moderate bitrate
ffmpeg -i source.mp4 -vf "scale=-2:1080" -c:v libx264 -preset slow -crf 23 \
  -g 12 -keyint_min 12 -sc_threshold 0 -movflags +faststart \
  -an city-build.mp4
```

- Target **1080p** for web scrub (4K looks nicer but seeks much worse)
- Keyframe every ~0.5s (`-g 12` at 24fps) so seeks land quickly
- Keep file roughly **under 8–12 MB** if possible
- `+faststart` helps progressive buffering
- Source can still be 4K; deliver a scrub-optimized derivative

Current interim files (~23–29 MB) will feel laggy on most machines until
re-encoded as above.

## Visit state

`localStorage` key `4days_city_visit` = `returning` after the visitor finishes
~92% of the first-visit scrub. Clear it in DevTools to preview the build again.
