/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.js', './components/**/*.js', './screens/**/*.js', './navigation/**/*.js', './context/**/*.js'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // the "black" of the brand
        ink: { DEFAULT: '#0b0b0c', 800: '#141416', 700: '#1d1d21' },
      },
    },
  },
  plugins: [],
};
