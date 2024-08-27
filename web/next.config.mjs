// not sure if good approach
const TAURI_DEV = true

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	output: TAURI_DEV ? "export" : undefined,
	typescript: {
		// TODO: hacky for tauri
		ignoreBuildErrors: TAURI_DEV ? true : false
	},
	images: {
		// TODO: hacky for tauri
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
