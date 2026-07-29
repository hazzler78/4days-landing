# 3D City Assets

Placera framtida GLB-modeller här. Video är fortfarande den primära visuella källan
tills `CITY_ASSETS.useGlbCity` sätts till `true` i `src/lib/city-assets.ts`.

## Filer

| Fil | Användning |
|-----|------------|
| `city-build.glb` | Första besök — stad under uppbyggnad (kranar, ställningar, drones) |
| `city-complete.glb` | Återbesök — färdig grön futuristisk stad |

## Krav för bra prestanda

- Draco- eller Meshopt-komprimering
- LOD-nivåer (eller separate low/mid/high meshes)
- Texturer som `.webp` / KTX2 där möjligt (max ~2k per material på web)
- Frustum-culling på (Three.js default)
- Total scene under ~15–25 MB gzipped om möjligt

## Aktivera GLB-läge

1. Lägg in modellerna ovan.
2. I `src/lib/city-assets.ts`: sätt `useGlbCity: true`.
3. `ScrollCity` byter då till R3F-modell scrub (samma scroll-progress API).

## Video (nuvarande produktionsspår)

Byt ut:

- `/public/video/city-build.mp4` (+ valfritt `.webm`)
- `/public/video/city-complete.mp4` (+ valfritt `.webm`)
- `/public/video/posters/city-build.webp` (eller `.jpg`)
- `/public/video/posters/city-complete.webp`

Uppdatera sökvägar i `CITY_ASSETS` om du byter filnamn.
