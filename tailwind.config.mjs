/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.{html,js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Sora', 'sans-serif']
      },
      boxShadow: {
        glow: '0 24px 80px rgba(8, 15, 28, 0.45)'
      },
      colors: {
        ink: {
          950: '#060b14',
          900: '#0b1220',
          800: '#111a2d'
        },
        mint: {
          300: '#8cf7de',
          400: '#63e6be',
          500: '#2bc4a8'
        },
        sun: {
          300: '#ffe28a',
          400: '#f2c94c',
          500: '#d9a91e'
        }
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(99,230,190,0.18), transparent 34%), radial-gradient(circle at top right, rgba(242,201,76,0.14), transparent 28%), linear-gradient(160deg, #050b14 0%, #0b1630 52%, #07111f 100%)'
      }
    }
  },
  plugins: []
};
