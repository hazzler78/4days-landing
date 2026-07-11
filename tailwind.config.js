/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./*.html', './js/*.js'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0A2540', light: '#0f3354', dark: '#061a2b' },
        accent: { DEFAULT: '#00D4FF', dim: '#00b8e0', deep: '#0e7490' },
        growth: { DEFAULT: '#00C48C', dim: '#00a876', deep: '#047857' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
