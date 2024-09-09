import { generateUniqueSlug } from "./slug"

describe("generateUniqueSlug", () => {
	it("should generate a slug with the correct format", () => {
		const title = "This is a test title"
		const slug = generateUniqueSlug(title)
		expect(slug).toMatch(/^this-is-a-test-title-[a-f0-9]{8}$/)
	})

	it("should respect the maxLength parameter", () => {
		const title = "This is a very long title that should be truncated"
		const maxLength = 30
		const slug = generateUniqueSlug(title, maxLength)
		expect(slug.length).toBe(maxLength)
	})

	it("should generate different slugs for the same title", () => {
		const title = "Same Title"
		const slug1 = generateUniqueSlug(title)
		const slug2 = generateUniqueSlug(title)
		expect(slug1).not.toBe(slug2)
	})

	it("should handle empty strings", () => {
		const title = ""
		const slug = generateUniqueSlug(title)
		expect(slug).toMatch(/^-[a-f0-9]{8}$/)
	})
})
