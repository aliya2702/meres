/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B211A',
        forest: '#2C382A',
        taupe: '#AD9680',
        linen: '#EFE9DE',
        'linen-deep': '#E4DBCB',
      },
      fontFamily: {
        serif: ['Libre Caslon Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
