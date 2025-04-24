/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/pages/main-page/**/*.html', // Incluye subdirectorios si existen
    './src/app/pages/main-page/**/*.ts'
  ],
  theme: {
    extend: {
      colors: {
        'libertadores-green': '#006341',
        'libertadores-gold': '#FFD700',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

