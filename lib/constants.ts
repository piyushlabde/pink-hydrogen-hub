import type { Station, YearProfile, SimOutputs } from "./types";

// ── Refueling / distribution nodes, positioned on the schematic map ──────────
// Coordinates are normalized (0–1) inside the map viewport. Layout evokes the
// Kola Peninsula corridor: plant at the source, nodes fanning toward Murmansk.
export const STATIONS: Station[] = [
  {
    id: "polyarnye-zori",
    name: "Polyarnye Zori Depot",
    x: 0.18,
    y: 0.42,
    status: "online",
    queue: 0,
    pressureBar: 700,
    bufferKg: 240,
  },
  {
    id: "apatity",
    name: "Apatity Interchange",
    x: 0.38,
    y: 0.66,
    status: "busy",
    queue: 3,
    pressureBar: 690,
    bufferKg: 118,
  },
  {
    id: "monchegorsk",
    name: "Monchegorsk Freight",
    x: 0.52,
    y: 0.34,
    status: "online",
    queue: 1,
    pressureBar: 700,
    bufferKg: 205,
  },
  {
    id: "olenegorsk",
    name: "Olenegorsk Transit",
    x: 0.68,
    y: 0.52,
    status: "online",
    queue: 0,
    pressureBar: 695,
    bufferKg: 176,
  },
  {
    id: "murmansk-port",
    name: "Murmansk Port Terminal",
    x: 0.86,
    y: 0.28,
    status: "maintenance",
    queue: 0,
    pressureBar: 0,
    bufferKg: 44,
  },
  {
    id: "kirovsk",
    name: "Kirovsk Municipal",
    x: 0.44,
    y: 0.84,
    status: "online",
    queue: 2,
    pressureBar: 700,
    bufferKg: 152,
  },
];

// ── Trust narrative: Year 0 (feasibility) vs Year 5 (built-out) ─────────────
export const YEAR_PROFILES: Record<0 | 5, YearProfile> = {
  0: {
    year: 0,
    capacityMw: 1,
    eyebrow: "Baseline — 2025 feasibility",
    headline: "One megawatt, proving the loop.",
    copy: "A single PEM electrolyzer draws surplus off-peak output from one VVER unit. The pilot validates the conversion economics, the safety envelope, and the first two community offtake routes before any scale-up commitment.",
    stats: [
      { label: "Electrolysis capacity", value: "1", unit: "MW" },
      { label: "Active offtake nodes", value: "2", unit: "sites" },
      { label: "Annual H₂ output", value: "160", unit: "t/yr" },
      { label: "CO₂ avoided", value: "1.4", unit: "kt/yr" },
    ],
    activeStations: ["polyarnye-zori", "apatity"],
  },
  5: {
    year: 5,
    capacityMw: 10,
    eyebrow: "Target — Year 5 build-out",
    headline: "Ten megawatts, a regional network.",
    copy: "Ten MW of stacked electrolysis absorb curtailed output across the daily trough. Hydrogen reaches six nodes: fertilizer synthesis, grid-balancing storage, and a heavy-vehicle refueling corridor from Polyarnye Zori to the Murmansk port.",
    stats: [
      { label: "Electrolysis capacity", value: "10", unit: "MW" },
      { label: "Active offtake nodes", value: "6", unit: "sites" },
      { label: "Annual H₂ output", value: "1,600", unit: "t/yr" },
      { label: "CO₂ avoided", value: "14", unit: "kt/yr" },
    ],
    activeStations: STATIONS.map((s) => s.id),
  },
};

// ── What-if simulator math ───────────────────────────────────────────────────
// All coefficients illustrative, derived from the 1MW→10MW basis. Linear-ish
// with mild economies of scale, kept legible for a feasibility narrative.
export function simulate(capacityMw: number): SimOutputs {
  const mw = Math.min(10, Math.max(1, capacityMw));
  // ~160 t H2 per MW-year at the pilot's capacity factor.
  const h2TonnesYr = Math.round(mw * 160);
  // Fertilizer: ~1 t H2 feeds ~5.6 t NH3; a mid-size farm program ≈ 90 t H2/yr.
  const farmsFed = Math.round((h2TonnesYr * 0.34) / 9);
  // Buses: fuel-cell bus uses ~9 kg/100km, ~55,000 km/yr ≈ 5 t H2/bus-yr.
  const busesFueled = Math.round((h2TonnesYr * 0.28) / 5);
  // Grid return via reconversion (round-trip ~40%): stored H2 → MWh back.
  const mwhReturned = Math.round(h2TonnesYr * 0.38 * 33.3 * 0.4);
  const co2AvoidedTyr = Math.round(h2TonnesYr * 8.9);
  return { farmsFed, busesFueled, mwhReturned, h2TonnesYr, co2AvoidedTyr };
}

// ── Cited sources for the footer ─────────────────────────────────────────────
export const SOURCES = [
  {
    label: "Rosatom — Kola NPP hydrogen feasibility study",
    note: "1 MW PEM pilot, scaling pathway to 10 MW electrolysis.",
    href: "https://www.rosatom.ru/en/",
  },
  {
    label: "IAEA — Nuclear–hydrogen cogeneration overview",
    note: "VVER off-peak surplus as electrolysis feedstock.",
    href: "https://www.iaea.org/topics/non-electric-applications/hydrogen-production",
  },
  {
    label: "IEA — Global Hydrogen Review",
    note: "Emission factors and electrolyzer efficiency bands.",
    href: "https://www.iea.org/reports/global-hydrogen-review-2024",
  },
];

// Color of a station status dot.
export const STATUS_META: Record<
  Station["status"],
  { label: string; tone: string }
> = {
  online: { label: "Online", tone: "#4ADE80" },
  busy: { label: "In demand", tone: "#FF2D78" },
  maintenance: { label: "Maintenance", tone: "#6B6B76" },
};
