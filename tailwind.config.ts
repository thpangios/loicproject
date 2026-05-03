import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F1F4F9",
          100: "#DDE4EE",
          200: "#B8C5D8",
          300: "#8FA2BD",
          400: "#5E7799",
          500: "#3B5479",
          600: "#1E3A5F",
          700: "#15294A",
          800: "#0F1E37",
          900: "#0A1426",
        },
        cream: {
          50: "#FBF8F2",
          100: "#F4EFE6",
          200: "#EBE3D2",
          300: "#DDD0B6",
        },
        gold: {
          400: "#D4B585",
          500: "#B8935A",
          600: "#9A7942",
        },
        ink: {
          DEFAULT: "#1A1F2E",
          muted: "#5A6378",
          subtle: "#8A93A6",
        },
        line: "#E5DED0",
        surface: "#FFFFFF",
        bg: "#F4EFE6",
        success: "#2F7A5C",
        warning: "#B8935A",
        danger: "#A8413A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 30, 55, 0.04), 0 1px 3px rgba(15, 30, 55, 0.03)",
        elevated: "0 4px 12px rgba(15, 30, 55, 0.06), 0 2px 4px rgba(15, 30, 55, 0.04)",
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
