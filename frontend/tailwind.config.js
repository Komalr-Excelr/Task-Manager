/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#daeefe',
          200: '#bcdcff',
          300: '#90c3fe',
          400: '#5aa3fb',
          500: '#2f83f6',
          600: '#1967d2',
          700: '#1557ad',
          800: '#154a8d',
          900: '#163f73',
        },
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626',
      },
    },
  },
  plugins: [],
}