/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emaresa: {
          bg: '#FAF8FF',
          card: '#FFFFFF',
          text: '#14151A',
          blue: '#0055FF',
          green: '#16A34A',
          greenBg: '#EAFBF1',
          yellow: '#CA8A04',
          yellowBg: '#FFF8E5',
          red: '#DC2626',
          redBg: '#FDECEC',
        },
      },
      fontFamily: {
        display: ['Hanken Grotesk', 'Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
