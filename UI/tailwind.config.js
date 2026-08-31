/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        ink: {
          950: "#0a0809",
          900: "#121012",
          800: "#1c1719",
          700: "#2b2224",
        },
        surface: {
          DEFAULT: "#faf8f7",
          card: "#ffffff",
        },
      },
      boxShadow: {
        // Kept intentionally subtle: a soft black shadow does the actual
        // lifting, with only a faint brand-colored ring for identity -
        // not a big colored blur behind every panel.
        glow: "0 0 0 1px rgba(234,88,12,0.06), 0 6px 16px -6px rgba(0,0,0,0.4)",
        // Used on modals, dropdowns and the login card - purely a soft
        // black shadow, no brand-color glow, so those panels read as
        // "lifted off a dark background" rather than "glowing orange".
        "glow-lg": "0 16px 32px -12px rgba(0,0,0,0.5)",
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        "card-hover": "0 4px 12px rgba(16,24,40,0.06), 0 10px 24px -10px rgba(0,0,0,0.3)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: 0, transform: "translateX(16px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.96)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: 0.7 },
          "70%": { transform: "scale(1.6)", opacity: 0 },
          "100%": { transform: "scale(1.6)", opacity: 0 },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-in-right": "slide-in-right 0.35s ease-out both",
        "scale-in": "scale-in 0.25s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        float: "float 3.5s ease-in-out infinite",
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
}