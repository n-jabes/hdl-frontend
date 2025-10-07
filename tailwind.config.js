/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional dark palette tuned for better contrast and depth
        mainBlack: '#0F1214', // deeper canvas
        surface: '#1A1D21', // cards, navs
        surfaceMuted: '#15181A',
        mainBlue: '#0F86D3', // primary accent
        accent: '#22C55E', // success
        warning: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
}
