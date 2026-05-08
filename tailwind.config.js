/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f7',
          100: '#fce7f4',
          200: '#fbcfe9',
          300: '#f8a4d8',
          400: '#f370c1',
          500: '#e94ca6',
          600: '#d62d87',
          700: '#b91d6b',
          800: '#971858',
          900: '#7d1649',
        },
        accent: {
          50: '#f7f5f3',
          100: '#ede8e3',
          200: '#d9cfc4',
          300: '#c4b3a3',
          400: '#a68f7a',
          500: '#8b6f54',
          600: '#6d5542',
          700: '#574435',
          800: '#4a3a2d',
          900: '#3d2f24',
        }
      },
      fontFamily: {
        sans: ['Josefin Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
