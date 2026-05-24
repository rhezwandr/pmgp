import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFBFB",
        surface: "#FFFFFF",
        border: "#F1D7D7",
        primary: "#B91C1C",
        "primary-strong": "#7F1D1D",
        success: "#16A34A",
        warning: "#D97706",
        error: "#DC2626",
        muted: "#766363",
        locked: "#A8A29E"
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        calm: "0 12px 32px rgba(127, 29, 29, 0.08)",
        subtle: "0 1px 2px rgba(127, 29, 29, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
