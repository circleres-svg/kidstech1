/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Stitch named tokens
        "primary": "#00658b",
        "primary-container": "#3aa6d9",
        "on-primary": "#ffffff",
        "on-primary-container": "#00384e",
        "primary-fixed": "#c4e7ff",
        "primary-fixed-dim": "#7dd0ff",
        "secondary": "#49607d",
        "secondary-container": "#c4dcfe",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#4a617e",
        "secondary-fixed": "#d2e4ff",
        "tertiary": "#8b5000",
        "tertiary-container": "#d98a32",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#4f2b00",
        "tertiary-fixed": "#ffdcbf",
        "surface": "#f9f9ff",
        "surface-bright": "#f9f9ff",
        "surface-dim": "#cbdafc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f3ff",
        "surface-container": "#e8eeff",
        "surface-container-high": "#dfe8ff",
        "surface-container-highest": "#d7e3ff",
        "on-surface": "#0b1b35",
        "on-surface-variant": "#3e484f",
        "outline": "#6f7880",
        "outline-variant": "#bec8d0",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        // Kid Mode Specific Tokens
        "kid-bg": "#FFF8EC",
        "kid-primary": "#3AA6D9",
        "kid-accent": "#FF6B4A",
        "kid-success": "#4FBE8E",
        "kid-warning": "#FFC93C",
        "kid-ink": "#33302A",
        "kid-purple": "#9B7FD1",

        // Parent Mode Specific Tokens
        "parent-bg": "#F6F8FB",
        "parent-surface": "#FFFFFF",
        "parent-ink": "#1C2B45",
        "parent-secondary": "#5B7290",
        "parent-accent": "#E8963D",
        "parent-teal": "#2E9E8B",
        "parent-alert": "#D9584F"
      },
      fontFamily: {
        "display-hero": ["Fredoka", "sans-serif"],
        "headline-kid-lg": ["Fredoka", "sans-serif"],
        "headline-kid-md": ["Fredoka", "sans-serif"],
        "label-prominent": ["Fredoka", "sans-serif"],
        "body-kid-lg": ["Nunito Sans", "sans-serif"],
        "body-kid-md": ["Nunito Sans", "sans-serif"],
        "headline-parent-lg": ["Public Sans", "sans-serif"],
        "headline-parent-md": ["Public Sans", "sans-serif"],
        "body-parent-md": ["Public Sans", "sans-serif"],
        "body-parent-sm": ["Public Sans", "sans-serif"],
        "label-data": ["Public Sans", "sans-serif"]
      },
      borderRadius: {
        'sm': '0.5rem',
        'DEFAULT': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        'full': '9999px',
      },
      boxShadow: {
        'kid-blue': '0px 6px 0px 0px #004c69',
        'kid-blue-active': '0px 1px 0px 0px #004c69',
        'kid-coral': '0px 6px 0px 0px #b83c20',
        'kid-coral-active': '0px 1px 0px 0px #b83c20',
        'kid-green': '0px 6px 0px 0px #2a7c58',
        'kid-yellow': '0px 6px 0px 0px #c28e10',
        'kid-card': '0px 8px 24px rgba(51, 48, 42, 0.08)',
        'parent-card': '0 1px 3px rgba(28, 43, 69, 0.05), 0 1px 2px rgba(28, 43, 69, 0.03)',
        'parent-float': '0 10px 15px -3px rgba(28, 43, 69, 0.08), 0 4px 6px -2px rgba(28, 43, 69, 0.04)'
      }
    },
  },
  plugins: [],
}
