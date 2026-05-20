import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mousse: {
          50: "#f3f7f1",
          100: "#e3ecdd",
          200: "#c7d9bc",
          300: "#a3bf91",
          400: "#7ea36a",
          500: "#5f874c",
          600: "#496c39",
          700: "#3a562f",
          800: "#304527",
          900: "#293a22",
          950: "#13200f",
        },
        terre: {
          50: "#f8f4ee",
          100: "#ede1cd",
          200: "#dcc29c",
          300: "#c79e6a",
          400: "#b07f48",
          500: "#9a673a",
          600: "#825030",
          700: "#653b28",
          800: "#4c2d23",
          900: "#3a241c",
        },
        ocre: {
          400: "#d4a747",
          500: "#bf8d2c",
          600: "#a0721f",
        },
        parchemin: {
          50: "#fbf7ed",
          100: "#f4ecd2",
          200: "#ead7a3",
        },
        sacre: {
          gold: "#c9a227",
          ink: "#1b2a16",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grain-paper":
          "radial-gradient(ellipse at top, rgba(201,162,39,0.06), transparent 60%), radial-gradient(ellipse at bottom, rgba(74,108,57,0.08), transparent 60%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "grow": "grow 0.4s ease-out",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        grow: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
