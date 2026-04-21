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
        // Palette principale EcoScience
        primary: {
          DEFAULT: "#5e17eb",
          50: "#f3effe",
          100: "#e4dafd",
          200: "#c9b5fb",
          300: "#a882f7",
          400: "#8b4ff3",
          500: "#5e17eb",
          600: "#4d11c7",
          700: "#3d0da0",
          800: "#2d0a78",
          900: "#1e074f",
        },
        success: {
          DEFAULT: "#7ed957",
          50: "#f2fce9",
          100: "#e0f8cc",
          200: "#c1f09d",
          300: "#9ce466",
          400: "#7ed957",
          500: "#5bbf30",
          600: "#459922",
          700: "#35741d",
          800: "#2d5d1c",
          900: "#284e1c",
        },
        ocean: {
          DEFAULT: "#0ea5e9",
          light: "#7dd3fc",
          dark: "#0369a1",
          deep: "#082f49",
        },
        sand: "#fbbf24",
        coral: "#fb7185",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      borderRadius: {
        kid: "1.25rem",
        bubble: "2rem",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        "wave": "wave 2s ease-in-out infinite",
        "bubble": "bubble 4s ease-in-out infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "swim": "swim 6s ease-in-out infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        wave: {
          "0%": { transform: "translateX(0) translateY(0)" },
          "25%": { transform: "translateX(5px) translateY(-3px)" },
          "50%": { transform: "translateX(0) translateY(0)" },
          "75%": { transform: "translateX(-5px) translateY(-3px)" },
          "100%": { transform: "translateX(0) translateY(0)" },
        },
        bubble: {
          "0%": { transform: "translateY(100%) scale(0.5)", opacity: "0" },
          "50%": { opacity: "0.8" },
          "100%": { transform: "translateY(-100vh) scale(1)", opacity: "0" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(94, 23, 235, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(94, 23, 235, 0.6)" },
        },
        swim: {
          "0%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "25%": { transform: "translateX(10px) translateY(-5px) rotate(2deg)" },
          "50%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "75%": { transform: "translateX(-10px) translateY(-5px) rotate(-2deg)" },
          "100%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
