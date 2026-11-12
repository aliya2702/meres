# Project memory

## Product intent & audience

- MERES: residential remodeling brand website (five pages, static React + TS).
- Audience: homeowners seeking high-end remodeling; implies trust, craft, and taste.
- Foundation phase: motion engine, content files, and logo asset are now in place; page layouts to follow.

## Brand personality & voice

- Editorial, refined, craft-forward; copy is canonical and fixed (see constraints).
- Logo is a custom mark (`MeresMark`), never retyped as text.

## Visual design & UX direction

- Motion-heavy production aesthetic: WebGL image effects (`GLImage`), page transitions (`PageVeil`), smooth scroll (`lenis`), custom `Cursor`, text reveal (`splitText`), magnetic/repel interactions.
- Color tokens include **cream** and **forest** variants (via `MeresMark` `currentColor`).
- Images: single 1672px WebP per asset + inline LQIP; `srcset`-free `<img>` with explicit `width`/`height`, `loading="lazy"` (hero eager), blur-up from LQIP.
- Logo: use `MeresMark.tsx` or `public/brand/meres-mark.svg`; never redraw.

## Decisions, constraints & rationale

- Existing engine files (`src/gl/*`, `src/motion/*`, `src/components/*`) are authoritative — reuse, do not rewrite.
- `src/content/copy.ts` is canonical copy: use verbatim; never rewrite, shorten, or add.
- Ignore `BRAND.images` PNG paths in `copy.ts`; all real image data comes from `src/content/images.ts`.
- Installed deps: `gsap`, `lenis`, `react-router-dom`. No other UI/icon/theme packages.
- Path alias `@/` → `src/`. Icons via `lucide-react`.
- Type-check and production build both pass with zero errors after engine setup.

## Open questions & assumptions

- Five page layouts and routing structure not yet specified; assumed multi-route via `react-router-dom`.
- No Tailwind theme tokens (colors, fonts, spacing) documented yet; infer from engine tokens and existing components as pages are built.
- Exact page list and navigation labels pending; likely Home, Work/Projects, Services, About, Contact for a remodeling brand.