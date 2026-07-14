// Domain types for the Pink Hydrogen Hub.

export interface LiveTelemetry {
  /** kg H2 produced per hour at the electrolyzer */
  h2RateKgH: number;
  /** conversion efficiency: surplus MWh → H2 energy, as a percentage 0–100 */
  conversionRate: number;
  /** current grid load as a percentage 0–100 */
  gridLoadPct: number;
  /** measured dose rate at plant boundary, microSv/h */
  radiationUSvH: number;
  /** storage tank fill, percentage 0–100 */
  storagePct: number;
  /** power currently drawn by electrolysis, MW */
  electrolysisMw: number;
  /** unix ms */
  t: number;
}

export interface HistoryPoint {
  t: number;
  h2RateKgH: number;
  gridLoadPct: number;
}

export type StationStatus = "online" | "busy" | "maintenance";

export interface Station {
  id: string;
  name: string;
  /** normalized 0–1 coordinates within the schematic map viewport */
  x: number;
  y: number;
  status: StationStatus;
  /** vehicles currently in queue */
  queue: number;
  /** dispenser pressure, bar */
  pressureBar: number;
  /** kg available in local buffer */
  bufferKg: number;
}

export type NarrativeYear = 0 | 5;

export interface YearProfile {
  year: NarrativeYear;
  capacityMw: number;
  eyebrow: string;
  headline: string;
  copy: string;
  stats: { label: string; value: string; unit: string }[];
  /** which station ids are active in this year */
  activeStations: string[];
}

export interface SimOutputs {
  farmsFed: number;
  busesFueled: number;
  mwhReturned: number;
  h2TonnesYr: number;
  co2AvoidedTyr: number;
}
