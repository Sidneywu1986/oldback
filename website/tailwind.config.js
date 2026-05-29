/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-white': '#f6f5f4',
        'warm-dark': '#31302e',
        'warm-gray': '#615d59',
        'warm-gray-light': '#a39e98',
        'near-black': 'rgba(0,0,0,0.95)',
        'primary-red': '#c41e3a',
        'primary-red-dark': '#a6152f',
        'primary-red-light': '#d6425a',
        'notion-teal': '#2a9d99',
        'notion-green': '#1aae39',
        'notion-orange': '#dd5b00',
        'notion-blue': '#0075de',
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
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
