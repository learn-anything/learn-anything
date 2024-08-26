import { urlSchema } from "./schema"

function validateUrl(url: string): boolean {
	const result = urlSchema.safeParse(url)
	return result.success
}

describe("URL Validation", () => {
	test("valid full URLs", () => {
		expect(validateUrl("https://www.example.com")).toBe(true)
		expect(validateUrl("http://example.com")).toBe(true)
		expect(validateUrl("https://subdomain.example.co.uk")).toBe(true)
	})

	test("valid domain names without protocol", () => {
		expect(validateUrl("aslamh.com")).toBe(true)
		expect(validateUrl("www.example.com")).toBe(true)
		expect(validateUrl("subdomain.example.co.uk")).toBe(true)
	})

	test("invalid URLs", () => {
		expect(validateUrl("https://aslamh")).toBe(false)
		expect(validateUrl("ftp://example.com")).toBe(false)
		expect(validateUrl("http://.com")).toBe(false)
		expect(validateUrl("just-a-string")).toBe(false)
		expect(validateUrl("aslamh")).toBe(false)
	})

	test("edge cases", () => {
		expect(validateUrl("https://localhost")).toBe(false) // No TLD
		expect(validateUrl("https://123.45.67.89")).toBe(false) // IP address
		expect(validateUrl("https://example.com/path?query=value")).toBe(true) // With path and query
	})

	test("empty and whitespace inputs", () => {
		expect(validateUrl("")).toBe(false)
		expect(validateUrl("   ")).toBe(false)
	})
})
