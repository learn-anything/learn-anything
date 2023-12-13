/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin")

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "../shared/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      zIndex: {
        1: "1",
        "-1": "-1"
      },
      keyframes: {
        iconSlide: {
          "0%": { opacity: 0, transform: "translateX(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        DefaultSlide: {
          "0%": { transform: "translateX(20px)" },
          "100%": { transform: "translateY(0)" }
        }
      },
      animation: {
        iconSlide: "iconSlide 0.5s ease-out forwards",
        DefaultSlide: "DefaultSlide 0.5s ease-out forwards"
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".flex-center": {
          display: "flex",
          "align-items": "center",
          "justify-content": "center"
        },
        ".flex-between": {
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between"
        },
        ".border-dark": {
          border: "1px solid #282828"
        },
        ".border-light": {
          border: "1px solid #69696951"
        },
        ".flex-col": {
          display: "flex",
          "flex-direction": "column"
        },

        ".flex-row": {
          display: "flex",
          "flex-direction": "row"
        },
        ".button-hover": {
          color: "rgb(34 197 94)",
          "border-radius": "8px",
          "transition-property": "all",
          "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
          "transition-duration": "150ms",
          background: "rgb(38 38 38)"
        }
      }
      addUtilities(newUtilities, ["responsive", "hover"])
    },
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities({
        "col-gap": (value) => {
          return {
            display: "flex",
            "flex-direction": "column",
            gap: value
          }
        }
      })
    })
  ]
}
