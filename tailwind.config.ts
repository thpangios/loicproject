import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EAF1FB",
          100: "#C9D8EE",
          200: "#A5BCDC",
          300: "#7E9BC4",
          400: "#5878A8",
          500: "#395985",
          600: "#274468",
          700: "#1A2E4C",
          800: "#12213A",
          900: "#0B1527",
        },
        cream: {
          50: "#FBF8F2",
          100: "#F4EFE6",
          200: "#EBE3D2",
          300: "#DDD0B6",
        },
        gold: {
          400: "#DFC08A",
          500: "#C69A56",
          600: "#9C753B",
        },
        ink: {
          DEFAULT: "#EDF3FF",
          muted: "#A8B5CF",
          subtle: "#7685A3",
        },
        line: "#253552",
        surface: "#13233B",
        bg: "#0A1324",
        success: "#70BA8D",
        warning: "#D6A85D",
        danger: "#D9756A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 18px 40px rgba(4, 10, 22, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
        elevated: "0 24px 50px rgba(4, 10, 22, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
