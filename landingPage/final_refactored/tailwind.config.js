/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src.css",
    "./src.js"
  ],
  theme: {
    extend: {
      colors: {
        'poppy': '#E65C4F',
        'sunbeam': '#F2B705',
        'peach': '#F2A08D',
        'avocado': '#A6A61B',
        'lavender': '#D4C1EC',
        'eggshell': '#F9F8F6',
        'beige': '#E8E1D0',
        'charcoal': '#403F3E'
      },
      fontFamily: {
        'display': ['Crimson Text', 'serif'],
        'body': ['Inter', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }]
      }
    },
  },
  plugins: [],
}