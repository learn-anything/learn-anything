/** @type {import('next').NextConfig} */

const isTauri = process.env.TAURI_ENV_DEBUG !== undefined
const isProd = process.env.NODE_ENV === "production"
const internalHost = process.env.TAURI_DEV_HOST || "localhost"

const commonConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**"
			}
		]
	}
}

const tauriConfig = {
	...commonConfig,
	output: "export",
	images: {
		...commonConfig.images,
		unoptimized: true
	},
	assetPrefix: isProd ? null : `http://${internalHost}:3000`,
	typescript: {
		ignoreBuildErrors: true
	}
}

const webConfig = {
	...commonConfig
}

const nextConfig = isTauri ? tauriConfig : webConfig

console.log(`Using ${isTauri ? "Tauri" : "Web"} config`)

export default nextConfig
