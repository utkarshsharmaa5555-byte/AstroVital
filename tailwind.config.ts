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
          surface: "#111622",
          panel: "#161B26",
          card: "#1B2230",
          border: "#30363D",
          borderMuted: "#21262D",
          borderHighlight: "#484F58",
        },
        flight: {
          nominal: "#2EA043",
          nominalGlow: "rgba(46, 160, 67, 0.2)",
          caution: "#D29922",
          cautionGlow: "rgba(210, 153, 34, 0.2)",
          warning: "#F85149",
          warningGlow: "rgba(248, 81, 73, 0.25)",
          info: "#58A6FF",
          infoGlow: "rgba(88, 166, 255, 0.2)",
          accent: "#A371F7",
        },
      },
      fontFamily: {
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
        DEFAULT: "4px",
        sm: "2px",
        md: "4px",
        lg: "6px",
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
