# Pink Hydrogen Hub

An interactive web experience for a nuclear power plant's CSR initiative that
converts surplus off-peak reactor electricity into **pink hydrogen**, distributed
to the surrounding community via fertilizer production, grid-balancing storage,
and vehicle refueling.

Built for **HackAtom Krasnoyarsk** (nuclear-tech CSR theme). Technical basis:
Rosatom's Kola NPP feasibility study — a 1 MW PEM electrolysis pilot scaling to
10 MW, drawing off a VVER-type reactor.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

Requires Node 18+ and network access to the npm registry for the first install.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** with a locked design-token system (`tailwind.config.ts`)
- **GSAP + ScrollTrigger** — hero assembly and scroll storytelling
- **Motion** (`motion` / `motion/react`) — micro-interactions, hover states,
  live count-ups, slider drag feedback
- Fonts via `next/font/google`: **Space Grotesk** (display) + **JetBrains Mono**
  (all data and numbers)

No backend required. Live telemetry is simulated (see below).

---

## Design system

One accent (`rose #FF2D78`) against a cool near-black base. Strict four-size type
scale plus a micro label size. Editorial asymmetric grids, hairline rules, zero
border-radius on structural surfaces, generous negative space. All tokens live in
`tailwind.config.ts` and every color/size is derived from them.

**Signature element:** the reactor → electrolyzer → three-branch schematic. It
assembles on scroll in the hero (`ReactorSchematic` + GSAP), then the same visual
language reappears as the live sankey in the dashboard, so the whole page reads as
one continuous system rather than a set of unrelated widgets.

**Motion:** every transition uses a deliberate cubic-bezier (registered in
`lib/easing.ts`) — never a default ease. Numbers always count up via Motion's
`animate()`; they never snap. A full `prefers-reduced-motion` path exists for
every animated element (the ambient canvas renders one static frame, GSAP
timelines are skipped, count-ups write final values directly).

---

## Feature map

| # | Feature | Where |
|---|---------|-------|
| 1 | Scroll-assembled reactor→electrolyzer→3-branch hero (GSAP ScrollTrigger, pinned) | `components/hero/` |
| 2 | Live dashboard — F-pattern, 6 visualizations, simulated WebSocket feed, count-up animation | `components/dashboard/` |
| 3 | Interactive station map — pins, availability status, click-to-reveal queue | `components/map/StationMap.tsx` |
| 4 | What-if capacity simulator — draggable 1→10 MW slider, live-updating stat cards | `components/simulator/` |
| 5 | Distribution breakdown — 3 cards, custom line-icon illustrations, hover-lift | `components/distribution/` |
| 6 | Year 0 / Year 5 narrative toggle — updates stats, copy, and map overlay together | `components/narrative/` |
| 7 | Ambient H₂ molecule particle field — low opacity, pauses on reduced motion / tab hidden | `components/ambient/` |
| 8 | Footer — cited Kola NPP sources, methodology note, team credits | `components/footer/` |
| + | **Language toggle (EN / RU)** — switches all UI copy; persists in localStorage; Cyrillic font subsets loaded | `components/i18n/`, `lib/i18n.ts` |

---

## The simulated telemetry feed

`lib/telemetry.ts` implements `TelemetryFeed` — a class with the exact
`subscribe(listener) → unsubscribe` surface a real WebSocket client would expose.
In production it would wrap a `WebSocket` to the plant SCADA gateway; here it emits
bounded, correlated random-walk frames on a 1.4 s cadence so the experience runs
with no backend.

- Grid load follows a slow diurnal sine; lower load frees more surplus, which
  drives more power to electrolysis, which raises H₂ output — the variables move
  together the way the real system would.
- One singleton feed serves the whole app (one "connection"), consumed through
  the `useTelemetry()` hook.

To connect a real feed, replace the body of `TelemetryFeed` with a `WebSocket`
and parse frames into the `LiveTelemetry` shape in `lib/types.ts`. Nothing else
needs to change.

---

## Project structure

```
app/                  App Router entry (layout, page, globals.css)
components/
  ambient/            Particle canvas
  dashboard/          KPIs, gauges, live sankey, time-series
  distribution/       Offtake cards + custom SVG icons
  footer/             Sources, methodology, credits
  hero/               Scroll-assembled schematic
  map/                Interactive corridor map
  narrative/          Year 0 / Year 5 toggle
  ui/                 Editorial primitives, CountUp, Nav
hooks/                useTelemetry, useReducedMotion
lib/                  types, constants, easing, telemetry
```

---

## Data & methodology

All figures are **illustrative of feasibility**, not audited operating data.
Capacity and distribution math (`lib/constants.ts → simulate()`) derives from the
Kola pilot basis using ~160 t H₂ / MW-year, ~20 kg H₂ / MWh, a ~40 % round-trip
reconversion efficiency, and IEA emission factors. Boundary dose figures sit in
the natural background band (0.10–0.20 µSv/h). Sources are cited in the footer.
