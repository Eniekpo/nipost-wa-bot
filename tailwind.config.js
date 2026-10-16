/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nipost: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#15803d',
          600: '#008751', // Nigerian Green
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        whatsapp: {
          light: '#25D366',
          teal: '#128C7E',
          darkTeal: '#075E54',
          bg: '#E5DDD5',
          chatDark: '#0b141a',
          bubbleIncoming: '#FFFFFF',
          bubbleOutgoing: '#E7FFDB',
          darkBubbleIncoming: '#202c33',
          darkBubbleOutgoing: '#005c4b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'emerald-glow': '0 0 25px -5px rgba(0, 135, 81, 0.4)',
        'ticket': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
