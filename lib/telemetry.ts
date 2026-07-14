import type { LiveTelemetry } from "./types";

/**
 * TelemetryFeed simulates a WebSocket push stream from the plant SCADA gateway.
 *
 * In production this class would wrap a real `WebSocket` connection to
 * wss://telemetry.kola-h2.example/live and emit parsed frames. Here it emits
 * bounded random-walk telemetry on a realistic cadence so the experience runs
 * with no backend while preserving the exact subscribe/unsubscribe surface a
 * real socket client would expose.
 */

type Listener = (frame: LiveTelemetry) => void;

// Plausible operating envelope. Off-peak surplus drives electrolysis.
const BOUNDS = {
  h2RateKgH: { min: 14, max: 210, start: 42 },
  conversionRate: { min: 68, max: 79, start: 74.2 }, // PEM stack efficiency band
  gridLoadPct: { min: 38, max: 91, start: 61 },
  radiationUSvH: { min: 0.08, max: 0.13, start: 0.1 }, // background-level boundary dose
  storagePct: { min: 22, max: 96, start: 58 },
  electrolysisMw: { min: 0.4, max: 10, start: 3.2 },
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

// Correlated random walk: grid load inversely nudges available surplus.
export class TelemetryFeed {
  private listeners = new Set<Listener>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private state: LiveTelemetry;
  private phase = 0;

  constructor(private intervalMs = 1400) {
    this.state = {
      h2RateKgH: BOUNDS.h2RateKgH.start,
      conversionRate: BOUNDS.conversionRate.start,
      gridLoadPct: BOUNDS.gridLoadPct.start,
      radiationUSvH: BOUNDS.radiationUSvH.start,
      storagePct: BOUNDS.storagePct.start,
      electrolysisMw: BOUNDS.electrolysisMw.start,
      t: Date.now(),
    };
  }

  private step() {
    this.phase += 0.18;
    // Grid load follows a slow diurnal sine plus jitter.
    const diurnal = Math.sin(this.phase) * 14;
    const gridLoad = clamp(
      61 + diurnal + (Math.random() - 0.5) * 6,
      BOUNDS.gridLoadPct.min,
      BOUNDS.gridLoadPct.max,
    );

    // Lower grid load → more surplus → more power to electrolysis.
    const surplusFactor = clamp((92 - gridLoad) / 54, 0.05, 1);
    const targetMw = 0.4 + surplusFactor * 9.6;
    const electrolysisMw = clamp(
      this.state.electrolysisMw + (targetMw - this.state.electrolysisMw) * 0.25,
      BOUNDS.electrolysisMw.min,
      BOUNDS.electrolysisMw.max,
    );

    const conversionRate = clamp(
      this.state.conversionRate + (Math.random() - 0.5) * 0.4,
      BOUNDS.conversionRate.min,
      BOUNDS.conversionRate.max,
    );

    // ~20 kg H2 per MWh at these efficiencies (illustrative).
    const h2RateKgH = clamp(
      electrolysisMw * 20 * (conversionRate / 74),
      BOUNDS.h2RateKgH.min,
      BOUNDS.h2RateKgH.max,
    );

    // Storage integrates production minus offtake; drift toward mid-band.
    const offtake = 30 + Math.random() * 40;
    const storagePct = clamp(
      this.state.storagePct + (h2RateKgH - offtake) * 0.02,
      BOUNDS.storagePct.min,
      BOUNDS.storagePct.max,
    );

    const radiationUSvH = clamp(
      this.state.radiationUSvH + (Math.random() - 0.5) * 0.004,
      BOUNDS.radiationUSvH.min,
      BOUNDS.radiationUSvH.max,
    );

    this.state = {
      h2RateKgH,
      conversionRate,
      gridLoadPct: gridLoad,
      radiationUSvH,
      storagePct,
      electrolysisMw,
      t: Date.now(),
    };

    this.listeners.forEach((l) => l(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Emit current frame immediately on subscribe (socket replay-of-last).
    listener(this.state);
    if (!this.timer) {
      this.timer = setInterval(() => this.step(), this.intervalMs);
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };
  }

  /** Seed a plausible history window for the time-series chart. */
  static seedHistory(points = 48, stepMs = 1800) {
    const now = Date.now();
    let load = 61;
    let phase = 0;
    const out = [];
    for (let i = points - 1; i >= 0; i--) {
      phase += 0.18;
      load = clamp(61 + Math.sin(phase) * 14 + (Math.random() - 0.5) * 6, 38, 91);
      const surplus = clamp((92 - load) / 54, 0.05, 1);
      const mw = 0.4 + surplus * 9.6;
      const h2 = clamp(mw * 20, 14, 210);
      out.push({
        t: now - i * stepMs,
        h2RateKgH: h2,
        gridLoadPct: load,
      });
    }
    return out;
  }
}

// Singleton — one feed for the whole app, like one socket connection.
let _feed: TelemetryFeed | null = null;
export function getTelemetryFeed() {
  if (!_feed) _feed = new TelemetryFeed();
  return _feed;
}
