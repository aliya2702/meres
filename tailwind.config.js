/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        forest: 'rgb(var(--forest-rgb) / <alpha-value>)',
        green: 'rgb(var(--green-rgb) / <alpha-value>)',
        taupe: 'rgb(var(--taupe-rgb) / <alpha-value>)',
        linen: 'rgb(var(--linen-rgb) / <alpha-value>)',
        'linen-deep': '#E4DBCB',
        'hero-linen': 'rgb(var(--hero-linen-rgb) / <alpha-value>)',
        'hero-ink': 'rgb(var(--hero-ink-rgb) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['Libre Caslon Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
