/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#0A0A0A',
        'champagne-gold': '#D4AF37',
        'warm-ivory': '#FAF9F6',
        'gold': '#ffe088',
        'light-beige': '#faf9f6',
        'cream': '#fdf8f8',
        'gold-dark': '#735c00',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '30px',
        '3xl': '32px',
        '4xl': '48px',
        '5xl': '84px',
      },
      letterSpacing: {
        'wider': '1.8px',
        'widest': '3.2px',
      },
      spacing: {
        'gutter': '80px',
        'gutter-tablet': '24px',
      },
    },
  },
  plugins: [],
}
