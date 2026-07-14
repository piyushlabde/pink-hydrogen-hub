"use client";

import { useEffect, useState } from "react";
import { getTelemetryFeed } from "@/lib/telemetry";
import type { LiveTelemetry } from "@/lib/types";

/**
 * Subscribes to the singleton telemetry feed and returns the latest frame.
 * Mirrors how a component would consume a real WebSocket subscription.
 */
export function useTelemetry(): LiveTelemetry | null {
  const [frame, setFrame] = useState<LiveTelemetry | null>(null);

  useEffect(() => {
    const feed = getTelemetryFeed();
    const unsub = feed.subscribe(setFrame);
    return unsub;
  }, []);

  return frame;
}
