import slugify from "slugify"
import crypto from "crypto"

export function generateUniqueSlug(title: string, maxLength: number = 60): string {
	const baseSlug = slugify(title, {
		lower: true,
		strict: true
	})
	const randomSuffix = crypto.randomBytes(4).toString("hex")

	const truncatedSlug = baseSlug.slice(0, Math.min(maxLength, 75) - 9)

	return `${truncatedSlug}-${randomSuffix}`
}
