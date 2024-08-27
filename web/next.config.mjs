// TODO: somehow there should be dynamic config for tauri/website
// one way is perhaps via env variable like below
const TAURI_DEV = false

/** @type {import('next').NextConfig} */
const nextConfig = {
	// due to some jazz things
	reactStrictMode: false,
	output: TAURI_DEV ? "export" : undefined,
	// TODO: should dist be at root or in `web`
	distDir: TAURI_DEV ? "../dist" : ".next",
	images: {
		// TODO: can't optimize in tauri it seems?
		unoptimized: TAURI_DEV ? true : false,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**"
			}
		]
	}
}

export default nextConfig
