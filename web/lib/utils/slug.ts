import slugify from "slugify"

type SlugLikeProperty = string | undefined

interface Data {
  [key: string]: any
}

export function generateUniqueSlug(
  existingItems: Data[],
  title: string,
  slugProperty: string = "slug",
  maxLength: number = 50
): string {
  const baseSlug = slugify(title, { lower: true, strict: true })
  let uniqueSlug = baseSlug.slice(0, maxLength)
  let num = 1

  const isSlugTaken = (slug: string) =>
    existingItems.some((item) => {
      const itemSlug = item[slugProperty] as SlugLikeProperty
      return itemSlug === slug
    })

  while (isSlugTaken(uniqueSlug)) {
    const suffix = `-${num}`
    uniqueSlug = `${baseSlug.slice(0, maxLength - suffix.length)}${suffix}`
    num++
  }

  return uniqueSlug
}
