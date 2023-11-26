import path from "path"
import solid from "vite-plugin-solid"
import solidStyled from "vite-plugin-solid-styled"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    solid(),
    solidStyled({
      filter: {
        include: ["src/**/*.tsx", "../shared/**/*.tsx"],
        exclude: "node_modules/**/*.{ts,js}",
      },
    }),
  ],
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome110" : "safari15",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
})
