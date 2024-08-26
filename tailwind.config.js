/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainBlack: '#1A1D1F',
        mainBlue: '#1075A6',
      },
    },
  },
  plugins: [],
}
