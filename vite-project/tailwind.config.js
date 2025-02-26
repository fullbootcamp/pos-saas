// File: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vintage-rose': {
          'soft-pink': '#FFE4E1',
          'light-pink': '#FFB6C1',
          'vibrant-pink': '#FF69B4',
          'medium-purple': '#9370DB',
          'deep-purple': '#8A2BE2',
        },
      },
    },
  },
  plugins: [],
}