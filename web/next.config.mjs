import { withSentryConfig } from "@sentry/nextjs"
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

export default withSentryConfig(nextConfig, {
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options

	org: process.env.NEXT_PUBLIC_SENTRY_ORG,
	project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,

	// Only print logs for uploading source maps in CI
	silent: !process.env.CI,

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Automatically annotate React components to show their full name in breadcrumbs and session replay
	reactComponentAnnotation: {
		enabled: true
	},

	// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
	// This can increase your server load as well as your hosting bill.
	// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
	// side errors will fail.
	// tunnelRoute: "/monitoring",

	// Hides source maps from generated client bundles
	hideSourceMaps: true,

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,

	// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
	// See the following for more information:
	// https://docs.sentry.io/product/crons/
	// https://vercel.com/docs/cron-jobs
	automaticVercelMonitors: true
})
