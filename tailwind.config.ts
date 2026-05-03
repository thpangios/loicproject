import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F3F7FF",
          100: "#DDE7F7",
          200: "#BBCBE5",
          300: "#90A7CB",
          400: "#6E88B4",
          500: "#4E6791",
          600: "#334B73",
          700: "#243754",
          800: "#17263D",
          900: "#0A1324",
        },
        gold: {
          300: "#F5D8A7",
          400: "#E8BE78",
          500: "#D79B47",
          600: "#A06B2A",
        },
        ink: {
          DEFAULT: "#F2F6FF",
          muted: "#AEBBD6",
          subtle: "#7F91B6",
        },
        line: "#243552",
        surface: "#101B2D",
        bg: "#08111F",
        success: "#57C28A",
        warning: "#E0AD4C",
        danger: "#E26E66",
        cyan: "#6FD3E1",
        cream: {
          50: "#FFF9EF",
          100: "#F7EFDF",
          200: "#E9DDC5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 26px 60px rgba(3, 9, 20, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        elevated: "0 36px 80px rgba(3, 9, 20, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
