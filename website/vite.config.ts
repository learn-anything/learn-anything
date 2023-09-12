import solid from "solid-start/vite"
import { defineConfig } from "vite"
import cloudflare from "solid-start-cloudflare-pages"

// note: cloudflare adapter breaks if you use node version 20, it has to be 18
export default defineConfig({
  plugins: [solid({ ssr: false, adapter: cloudflare({}) })],
})
