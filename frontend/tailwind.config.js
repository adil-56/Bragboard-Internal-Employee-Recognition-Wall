/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        // Brand: single primary — professional indigo
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        // Neutral grays — the backbone of the UI
        neutral: {
          0: "#FFFFFF",
          50: "#F8FAFC",
          100: "#F1F5F9",
          150: "#EBF0F6",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        // Semantic
        success: { 50: "#F0FDF4", 500: "#22C55E", 700: "#15803D" },
        warning: { 50: "#FFFBEB", 500: "#F59E0B", 700: "#B45309" },
        danger: { 50: "#FFF1F2", 500: "#F43F5E", 700: "#BE123C" },
        amber: { 50: "#FFFBEB", 400: "#FBBF24", 500: "#F59E0B", 600: "#D97706" },
      },
      boxShadow: {
        "xs": "0 1px 2px 0 rgba(15,23,42,0.05)",
        "sm": "0 1px 3px 0 rgba(15,23,42,0.08), 0 1px 2px -1px rgba(15,23,42,0.06)",
        "md": "0 4px 6px -1px rgba(15,23,42,0.07), 0 2px 4px -2px rgba(15,23,42,0.05)",
        "lg": "0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.05)",
        "xl": "0 20px 25px -5px rgba(15,23,42,0.08), 0 8px 10px -6px rgba(15,23,42,0.05)",
        "inner": "inset 0 1px 2px 0 rgba(15,23,42,0.06)",
        "focus": "0 0 0 3px rgba(79,70,229,0.15)",
      },
      borderRadius: {
        "sm": "6px",
        DEFAULT: "8px",
        "md": "10px",
        "lg": "12px",
        "xl": "16px",
        "2xl": "20px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
}
