/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
// tailwind.config.js
theme: {
  extend: {},
  screens: {
    xs: "480px", // add this line
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
},

  plugins: [require('tailwind-scrollbar-hide')],
}