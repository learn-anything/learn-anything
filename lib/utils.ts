export function getEnvOrThrow(env: string) {
	const value = process.env[env]
	if (!value) {
		throw new Error(`${env} environment variable is not set`)
	}
	return value
}
