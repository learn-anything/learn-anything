import { defineConfig } from "@solidjs/start/config"

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
	},
	server: {
		preset: "cloudflare_pages",
		rollupConfig: {
			external: ["node:async_hooks"],
		},
	},
})
