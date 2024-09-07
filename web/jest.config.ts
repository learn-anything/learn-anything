import type { Config } from "jest"
import nextJest from "next/jest.js"
import dotenv from "dotenv"

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./"
})

dotenv.config({ path: ".env.local" })

// Add any custom config to be passed to Jest
const config: Config = {
	coverageProvider: "v8",
	testEnvironment: "jsdom",
	// Add more setup options before each test is run
	// setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,
	moduleDirectories: ["node_modules", __dirname]
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
