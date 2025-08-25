/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'card': '#111317',
        'bg': '#0B0D10',
        'muted': '#9AA4AF',
        'primary': '#59D0FF',
        'accent': '#A855F7'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.35)'
      }
    },
  },
  plugins: [],
}
