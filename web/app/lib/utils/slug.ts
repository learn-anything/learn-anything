import slugify from "slugify"

export function generateUniqueSlug(
  title: string,
  maxLength: number = 60,
): string {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
  })

  // Web Crypto API
  const randomValues = new Uint8Array(4)
  crypto.getRandomValues(randomValues)
  const randomSuffix = Array.from(randomValues)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")

  const truncatedSlug = baseSlug.slice(0, Math.min(maxLength, 75) - 9)

  return `${truncatedSlug}-${randomSuffix}`
}
