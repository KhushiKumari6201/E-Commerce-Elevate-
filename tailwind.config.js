/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A0F2E',
          blue: '#2874F0',
          yellow: '#FFC200',
          orange: '#FB641B',
          light: '#F9F9F9',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        '3d': '0 8px 30px rgba(0,0,0,0.12)',
        '3d-hover': '0 20px 40px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
}
