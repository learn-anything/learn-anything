import solid from "solid-start/vite"
import { defineConfig } from "vite"
// import cloudflare from "solid-start-cloudflare-pages"

export default defineConfig({
  // TODO: uncommented because with it for some reason you get
  // Cannot set property crypto of #<Object> which has only a getter
  // https://discord.com/channels/722131463138705510/910635844119982080/1151125874150752266
  // https://discord.com/channels/595317990191398933/789155108529111069/1151125280795136111
  // plugins: [solid({ ssr: false, adapter: cloudflare({}) })],
  plugins: [solid({ ssr: false })],
})
