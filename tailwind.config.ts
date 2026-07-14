import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    // Strict, deliberate scale — no arbitrary values sprawl.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Base — near-black with a cool cast, not pure #000
      void: "#0A0A0C",
      surface: "#121216",
      elevated: "#17171C",
      hairline: "#26262C",
      "hairline-bright": "#33333B",
      // Text
      ink: "#EDEDF0",
      "ink-dim": "#A3A3AD",
      "ink-mute": "#6B6B76",
      // The single accent — electric rose. Used with restraint.
      rose: "#FF2D78",
      "rose-deep": "#B01050",
      "rose-glow": "#FF2D78",
      // Functional signal (very sparing — status only)
      signal: "#4ADE80",
      "signal-dim": "#1F5C38",
    },
    fontFamily: {
      display: ["var(--font-display)", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "ui-monospace", "monospace"],
    },
    // Strict type scale — exactly 4 sizes for content + micro for labels
    fontSize: {
      micro: ["0.6875rem", { lineHeight: "1.1", letterSpacing: "0.14em" }], // eyebrows/labels
      body: ["1rem", { lineHeight: "1.6", letterSpacing: "-0.005em" }],
      lead: ["1.375rem", { lineHeight: "1.45", letterSpacing: "-0.01em" }],
      title: ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
      display: ["clamp(3rem, 9vw, 7.5rem)", { lineHeight: "0.94", letterSpacing: "-0.04em" }],
    },
    extend: {
      maxWidth: {
        shell: "1440px",
      },
      transitionTimingFunction: {
        // Custom curves — never default ease-in-out
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-circ": "cubic-bezier(0.85, 0, 0.15, 1)",
        lift: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "pulse-node": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.25)" },
        },
        "dash-flow": {
          to: { strokeDashoffset: "-20" },
        },
      },
      animation: {
        "pulse-node": "pulse-node 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
        "dash-flow": "dash-flow 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
