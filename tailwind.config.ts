import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        studyverse: {
          darkest: "#060814",
          dark: "#0b0f29",
          card: "#12183a",
          cardBorder: "#232e66",
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          blue: "#3b82f6",
          gold: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e",
        },
      },
      backgroundImage: {
        "rpg-gradient": "radial-gradient(ellipse at top, #1e1b4b, #090d24, #050714)",
        "cyber-glow": "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)",
      },
      boxShadow: {
        "xp-glow": "0 0 20px rgba(139, 92, 246, 0.5)",
        "cyan-glow": "0 0 20px rgba(6, 182, 212, 0.5)",
        "gold-glow": "0 0 20px rgba(245, 158, 11, 0.4)",
        "card-glow": "0 8px 32px 0 rgba(16, 24, 64, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glowPulse: {
          "0%": { boxShadow: "0 0 10px rgba(139, 92, 246, 0.4)" },
          "100%": { boxShadow: "0 0 25px rgba(139, 92, 246, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
