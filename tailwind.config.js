/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFFFF',
          100: '#F4F3EE',
          200: '#C7D0DA',
          300: '#8D9EB1',
          400: '#768AA0',
          500: '#596D7D',
          600: '#2E3942',
          700: '#202A31',
          800: '#141A1E',
          900: '#0C1115',
        },
        secondary: {
          50: '#92BE00',
          100: '#BE4300'
        }
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

