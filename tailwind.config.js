/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          charcoal: '#1A1A1A',
          tomatoDeep: '#2A1414',
          cream: '#FAF4E8',
          creamSoft: '#FFF8F0',
          wine: '#8B0000',
          red: '#C8102E',
          redDark: '#B22222',
          orange: '#D86A32',
          green: '#228B22',
          basil: '#2F7D32',
          gold: '#F4A261',
          earth: '#7A4F2A',
          ink: '#33190F',
          wineDark: '#5A0E0E',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(51, 25, 15, 0.12)',
      },
    },
  },
  plugins: [],
}
