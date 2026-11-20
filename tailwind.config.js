/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF8',
          100: '#FFFBF2',
          200: '#F7EEDB',
        },
        sand: {
          300: '#F4C89A',
          400: '#E9AE7A',
          500: '#D98D57',
        },
        cobalt: {
          500: '#2E62FF',
          600: '#2355F5',
          700: '#193FCC',
        },
        sunny: {
          400: '#FFE44D',
          500: '#F9DA19',
          600: '#E5BE0A',
        },
        coral: {
          400: '#FF6B52',
          500: '#EF4B34',
          600: '#D63822',
        },
        ink: {
          800: '#252A34',
          900: '#1A1E2E',
        },
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '3px 3px 0px #1A1E2E',
        'pop-lg': '5px 5px 0px #1A1E2E',
        'pop-sm': '2px 2px 0px #1A1E2E',
      },
    },
  },
  plugins: [],
}
