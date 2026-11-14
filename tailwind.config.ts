import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spacecraft: {
          bg: "#0B0E14",
          surface: "#0F141D",
          panel: "#131822",
          card: "#18202E",
          cardHover: "#1E2738",
          border: "#262E3D",
          borderMuted: "#1B2230",
          borderHighlight: "#3B475C",
        },
        flight: {
          nominal: "#2EA043", // Soft Emerald Safe
          nominalGlow: "rgba(46, 160, 67, 0.2)",
          caution: "#D29922", // Warm Amber Advisory
          cautionGlow: "rgba(210, 153, 34, 0.2)",
          warning: "#F85149", // Coral Red Alert
          warningGlow: "rgba(248, 81, 73, 0.25)",
          info: "#58A6FF", // Telemetry Blue Baseline
          infoGlow: "rgba(88, 166, 255, 0.2)",
          accent: "#A371F7",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "'Courier New'",
          "monospace",
        ],
      },
      borderRadius: {
        DEFAULT: "10px",
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        '2xl': "16px",
      },
      keyframes: {
        "pulse-warning": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-warning": "pulse-warning 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radar-sweep 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
