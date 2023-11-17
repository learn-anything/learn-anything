/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./shared/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      zIndex: {
        1: "1",
        "-1": "-1"
      }
    }
  },
  plugins: []
}
