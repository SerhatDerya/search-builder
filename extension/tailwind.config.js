/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          elevated: "#ffffff",
        },
        border: {
          DEFAULT: "#e2e8f0",
          strong: "#cbd5e1",
        },
        text: {
          primary: "#0f172a",
          secondary: "#475569",
          muted: "#64748b",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      spacing: {
        popup: "360px",
        "section-gap": "20px",
        "control-gap": "12px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.06)",
        "bar-bottom": "0 2px 4px -1px rgb(0 0 0 / 0.06), 0 1px 2px -2px rgb(0 0 0 / 0.06)",
        "bar-top": "0 -2px 4px -1px rgb(0 0 0 / 0.06), 0 -1px 2px -2px rgb(0 0 0 / 0.06)",
      },
      fontSize: {
        "label": ["0.8125rem", { lineHeight: "1.25", fontWeight: "500" }],
        "body": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.33" }],
      },
      minHeight: {
        touch: "44px",
        "touch-sm": "36px",
      },
    },
  },
  plugins: [],
};
