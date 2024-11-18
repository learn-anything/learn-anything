import { defineConfig } from "@tanstack/start/config"
import tsConfigPaths from "vite-tsconfig-paths"

const is_tauri = process.env.TAURI_ENV_TARGET_TRIPLE !== undefined

const config = is_tauri
  ? defineConfig({
      vite: {
        envPrefix: ["VITE_", "TAURI_ENV_*"],
        build: {
          target:
            process.env.TAURI_ENV_PLATFORM == "windows"
              ? "chrome105"
              : "safari13",
          minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
          sourcemap: !!process.env.TAURI_ENV_DEBUG,
        },
        plugins: [
          tsConfigPaths({
            projects: ["./tsconfig.json"],
          }),
        ],
      },
      server: {
        preset: "static",
      },
    })
  : defineConfig({
      vite: {
        plugins: [
          tsConfigPaths({
            projects: ["./tsconfig.json"],
          }),
        ],
      },
    })

export default config
