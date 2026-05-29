/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Notion-inspired warm neutrals
        'warm-white': '#f6f5f4',
        'warm-dark': '#31302e',
        'warm-gray': '#615d59',
        'warm-gray-light': '#a39e98',
        'near-black': 'rgba(0,0,0,0.95)',
        
        // Chinese Red accent
        'primary-red': '#c41e3a',
        'primary-red-dark': '#a6152f',
        'primary-red-light': '#d6425a',
        
        // Semantic colors
        'notion-teal': '#2a9d99',
        'notion-green': '#1aae39',
        'notion-orange': '#dd5b00',
        'notion-pink': '#ff64c8',
        
        // Original semantic colors
        border: "rgba(0,0,0,0.1)",
        input: "rgba(0,0,0,0.1)",
        ring: "#c41e3a",
        background: "#ffffff",
        foreground: "rgba(0,0,0,0.95)",
        primary: {
          DEFAULT: "#c41e3a",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f6f5f4",
          foreground: "rgba(0,0,0,0.95)",
        },
        destructive: {
          DEFAULT: "#c41e3a",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f6f5f4",
          foreground: "#615d59",
        },
        accent: {
          DEFAULT: "#f6f5f4",
          foreground: "#c41e3a",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "rgba(0,0,0,0.95)",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "rgba(0,0,0,0.95)",
        },
        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "rgba(0,0,0,0.95)",
          primary: "#c41e3a",
          "primary-foreground": "#ffffff",
          accent: "#f6f5f4",
          "accent-foreground": "rgba(0,0,0,0.95)",
          border: "rgba(0,0,0,0.1)",
          ring: "#c41e3a",
        },
      },
      borderRadius: {
        xl: "16px",
        lg: "12px",
        md: "8px",
        sm: "5px",
        xs: "4px",
        pill: "9999px",
      },
      boxShadow: {
        'notion-card': 'rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84688px, rgba(0,0,0,0.02) 0px 0.8px 2.925px, rgba(0,0,0,0.01) 0px 0.175px 1.04062px',
        'notion-deep': 'rgba(0,0,0,0.01) 0px 1px 3px, rgba(0,0,0,0.02) 0px 3px 7px, rgba(0,0,0,0.02) 0px 7px 15px, rgba(0,0,0,0.04) 0px 14px 28px, rgba(0,0,0,0.05) 0px 23px 52px',
        'whisper': '0 0 0 1px rgba(0,0,0,0.1)',
      },
      fontFamily: {
        'inter': ['Inter', '-apple-system', 'system-ui', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        'display': '-0.033em',
        'heading': '-0.015em',
        'body': 'normal',
        'badge': '0.01em',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
