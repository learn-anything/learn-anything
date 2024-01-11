// tailwind.config.js
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{css,ts,tsx,jsx}'],
  // use the .ns-dark class to control dark mode (applied by NativeScript) - since 'media' (default) is not supported.
  darkMode: ["class", ".ns-dark"],
  theme: {
    extend: {}
  },
  plugins: [
    /**
     * A simple inline plugin that adds the ios: and android: variants
     *
     * Example usage:
     *
     *   <Label class="android:text-red-500 ios:text-blue-500" />
     *
     */
    plugin(function ({ addVariant }) {
      addVariant("android", ".ns-android &")
      addVariant("ios", ".ns-ios &")
    })
  ],
  corePlugins: {
    preflight: false // disables browser-specific resets
  }
}
