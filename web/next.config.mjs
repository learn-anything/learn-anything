/** @type {import('next').NextConfig} */

const isTauri = process.env.TAURI_ENV_DEBUG !== undefined;
const isProd = process.env.NODE_ENV === 'production';
const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

const common = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**"
			}
		]
	}
};

const config = {
	web: common,
	tauri: {
		...common,
		output: "export",
		images: {
			...common.images,
			// Needed for Image components in SSG mode
			unoptimized: true,
		},
		assetPrefix: isProd ? null : `http://${internalHost}:3000`,
	},
};

const nextConfig = isTauri ? config.tauri : config.web;

export default nextConfig
