import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"

const compat = new FlatCompat()

export default [
	{
		...compat
			.extends(
				"eslint:recommended",
				"plugin:@typescript-eslint/recommended-type-checked",
				"plugin:@typescript-eslint/stylistic-type-checked",
				"prettier"
			)
			.map(c => ({
				...c,
				files: ["**/*.{ts,tsx,mts}"]
			}))
	},
	{
		files: ["**/*.{js,jsx,cjs,mjs}"],
		...js.configs.recommended
	}
]
