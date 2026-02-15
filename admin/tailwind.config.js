/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ef",
          100: "#dde8db",
          200: "#bdd1b9",
          300: "#98b792",
          400: "#6C8E68",
          DEFAULT: "#6C8E68",
          500: "#5a7856",
          600: "#475f44",
          700: "#374a36",
          800: "#2d3b2c",
          900: "#263126",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#faf8f5",
          100: "#f3ede5",
          200: "#e4d5c5",
          300: "#d0b89f",
          400: "#b8956f",
          500: "#A0826D",
          DEFAULT: "#A0826D",
          600: "#8B6F47",
          700: "#6d563a",
          800: "#5c4831",
          900: "#4e3d2b",
          foreground: "#ffffff",
        },
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#6C8E68",
        background: "#ffffff",
        foreground: "#111827",
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f3f4f6",
          foreground: "#111827",
        },
      },
      keyframes: {
        "grow-up": {
          "0%, 100%": {
            clipPath: "inset(100% 0 0 0)",
            transform: "translateY(10px)",
            opacity: "0",
          },
          "50%": {
            clipPath: "inset(0 0 0 0)",
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "grow-up": "grow-up 0.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
