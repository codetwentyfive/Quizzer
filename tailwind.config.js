/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0050b4',
        'light-blue': '#4a7cc9',
        'white': '#ffffff',
        'primary-red': '#ee3a24',
        'soft-pink': '#ffbdc7',
        'primary-green': '#009B3C',
        'beige': '#f1e5d0',
      },
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} 