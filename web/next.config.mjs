// with this set to true, website works in both tauri (`bun app` and website with `bun web`)
// TODO: find a nicer way to do this, seems bad
// const DEV = process.env.DEV
const DEV = false

/** @type {import('next').NextConfig} */
const nextConfig = {
	// due to jazz issues
	reactStrictMode: false,
	output: DEV ? "export" : undefined,
	// TODO: should dist be at root or in `web`
	distDir: DEV ? "../dist" : ".next",
	images: {
		// TODO: can't optimize in tauri it seems?
		unoptimized: DEV ? true : false,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**"
			}
		]
	}
}

export default nextConfig
