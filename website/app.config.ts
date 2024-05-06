import { defineConfig } from "@solidjs/start/config"
import { prpcVite } from "@solid-mediakit/prpc-plugin"

export default defineConfig({
	ssr: false,
	vite: {
		optimizeDeps: {
			include: [
				"prosemirror-state",
				"prosemirror-transform",
				"prosemirror-model",
				"prosemirror-view",
			],
		},
		plugins: [prpcVite({ log: false }) as any],
	},
	server: {
		preset: "cloudflare_pages",
		rollupConfig: {
			external: ["node:async_hooks"],
		},
	},
})
