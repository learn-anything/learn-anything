import solid from "solid-start/vite"
import { defineConfig } from "vite"
import cloudflare from "solid-start-cloudflare-pages"

export default defineConfig({
  build: {
    target: "esnext"
  },
  plugins: [
    solid({
      ssr: false,
      adapter: cloudflare({}) as any
    }) as any
  ]
})
