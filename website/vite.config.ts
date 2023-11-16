import solid from "solid-start/vite"
import { defineConfig } from "vite"
import cloudflare from "solid-start-cloudflare-pages"
import solidStyled from "vite-plugin-solid-styled"

export default defineConfig({
  build: { target: "esnext" },
  esbuild: { target: "esnext" },
  plugins: [
    solid({ ssr: false }),
    cloudflare({}),
    solidStyled({
      filter: {
        include: ["src/**/*.tsx", "../shared/**/*.tsx"],
        exclude: "node_modules/**/*.{ts,js}"
      }
    })
  ],
  optimizeDeps: {
    exclude: ["@la/shared", "@la/shared/ui", "@la/shared/lib"]
  }
})
