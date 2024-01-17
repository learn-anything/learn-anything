// tailwind.config.js
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{css,ts,tsx,jsx}"],
  // use the .ns-dark class to control dark mode (applied by NativeScript) - since 'media' (default) is not supported.
  darkMode: ["class", ".ns-dark"],
  theme: {
    extend: {}
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
    plugin(function ({ addVariant }) {
      addVariant("android", ".ns-android &")
      addVariant("ios", ".ns-ios &")
    })
  ],
  corePlugins: {
    preflight: false // disables browser-specific resets
  }
}
