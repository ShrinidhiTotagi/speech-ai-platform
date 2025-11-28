/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        accent1: "#fb923c",
        accent2: "#f472b6",
        accent3: "#c084fc"
      },
      boxShadow: {
        'glass': '0 10px 30px rgba(12,10,30,0.06)',
        'xl-soft': '0 18px 44px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
