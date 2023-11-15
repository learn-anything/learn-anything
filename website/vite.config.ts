import solid from "solid-start/vite"
import { defineConfig } from "vite"
import cloudflare from "solid-start-cloudflare-pages"

export default defineConfig({
  build: { target: "esnext" },
  esbuild: { target: "esnext" },
  plugins: [
    solid({
      ssr: false
    }) as any,
    cloudflare({}) as any
  ],
  optimizeDeps: {
    exclude: ["@la/shared", "@la/shared/ui", "@la/shared/lib"]
  }
})
