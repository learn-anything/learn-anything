/** @type {import('next').NextConfig} */

const isTauri = process.env.TAURI_ENV_DEBUG !== undefined
const isProd = process.env.NODE_ENV === "production"
const internalHost = process.env.TAURI_DEV_HOST || "localhost"
const isIgnoreBuild = process.env.IGNORE_BUILD_ERRORS === "true"

const ignoreBuild = {
	typescript: {
		ignoreBuildErrors: true
	}
}

const commonConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**"
			}
		]
	},
	...(isIgnoreBuild ? ignoreBuild : {})
}

const tauriConfig = {
	...commonConfig,
	// output: "export",
	images: {
		...commonConfig.images,
		unoptimized: true
	},
	assetPrefix: isProd ? null : `http://${internalHost}:3000`,
	...ignoreBuild
}

const webConfig = {
	...commonConfig
}

const nextConfig = isTauri ? tauriConfig : webConfig

console.log(`Using ${isTauri ? "Tauri" : "Web"} config`)

export default nextConfig
