"use client";

/**
 * Custom line-icon illustrations — drawn, not stock. Each is a single-weight
 * schematic that matches the engineering-linework language of the hero diagram.
 */

const base = "stroke-rose";
const stroke = { strokeWidth: 1.5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function FertilizerIcon() {
  return (
    <svg viewBox="0 0 96 96" className="h-16 w-16">
      <g className={base} {...stroke}>
        {/* ammonia synthesis vessel + field furrows */}
        <rect x="30" y="14" width="36" height="30" rx="4" />
        <path d="M 38 14 L 38 8 M 58 14 L 58 8" />
        <path d="M 30 30 L 66 30" strokeOpacity="0.5" />
        <path d="M 48 44 L 48 56" />
        {/* dispersal to soil */}
        <path d="M 48 56 C 40 60 36 62 30 66 M 48 56 C 56 60 60 62 66 66" />
        {/* furrow rows */}
        <path d="M 20 74 C 36 70 60 70 76 74" strokeOpacity="0.7" />
        <path d="M 20 82 C 36 78 60 78 76 82" strokeOpacity="0.45" />
        {/* seedling */}
        <path d="M 48 66 L 48 74 M 48 68 C 44 66 42 64 42 60 M 48 68 C 52 66 54 64 54 60" strokeOpacity="0.6" />
      </g>
    </svg>
  );
}

export function GridStorageIcon() {
  return (
    <svg viewBox="0 0 96 96" className="h-16 w-16">
      <g className={base} {...stroke}>
        {/* storage tank */}
        <rect x="18" y="34" width="30" height="44" rx="6" />
        <path d="M 18 46 L 48 46" strokeOpacity="0.4" />
        <path d="M 18 58 L 48 58" strokeOpacity="0.4" />
        {/* level fill hint */}
        <path d="M 22 66 L 44 66" strokeWidth="3" strokeOpacity="0.5" />
        {/* transmission pylon + lines */}
        <path d="M 70 20 L 70 78" />
        <path d="M 58 34 L 82 34 M 60 44 L 80 44" />
        <path d="M 70 20 L 60 34 M 70 20 L 80 34" strokeOpacity="0.6" />
        {/* connecting flow */}
        <path d="M 48 56 C 56 56 60 44 60 44" strokeDasharray="2 4" strokeOpacity="0.7" />
      </g>
    </svg>
  );
}

export function VehicleFuelIcon() {
  return (
    <svg viewBox="0 0 96 96" className="h-16 w-16">
      <g className={base} {...stroke}>
        {/* dispenser */}
        <rect x="16" y="26" width="22" height="44" rx="4" />
        <path d="M 20 34 L 34 34" strokeOpacity="0.5" />
        <rect x="22" y="42" width="10" height="8" rx="1" strokeOpacity="0.6" />
        {/* nozzle hose */}
        <path d="M 38 46 C 46 46 46 54 52 54" />
        {/* bus silhouette */}
        <rect x="50" y="46" width="34" height="24" rx="3" />
        <path d="M 50 60 L 84 60" strokeOpacity="0.4" />
        <path d="M 56 46 L 56 60 M 66 46 L 66 60 M 76 46 L 76 60" strokeOpacity="0.4" />
        <circle cx="60" cy="74" r="4" />
        <circle cx="76" cy="74" r="4" />
        {/* H2 mark */}
        <path d="M 24 60 L 24 66 M 30 60 L 30 66 M 24 63 L 30 63" strokeOpacity="0.7" />
      </g>
    </svg>
  );
}
