import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"

const compat = new FlatCompat()

const typescriptConfig = compat.extends(
	"eslint:recommended",
	"plugin:@typescript-eslint/recommended-type-checked",
	"plugin:@typescript-eslint/stylistic-type-checked",
	"prettier"
)

const javascriptConfig = js.configs.recommended

export default [
	{
		files: ["**/*.{ts,tsx,mts}"],
		...typescriptConfig
	},
	{
		files: ["**/*.{js,jsx,cjs,mjs}"],
		...javascriptConfig
	}
]
