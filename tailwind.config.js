/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0edff',
          100: '#e0d9ff',
          200: '#c4b5ff',
          300: '#a78bfa',
          400: '#9370ff',
          500: '#7B61FF',
          600: '#6b4fff',
          700: '#5a3de6',
          800: '#4a30c0',
          900: '#3b279a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
