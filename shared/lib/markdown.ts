import remarkRehype from "remark-rehype"
import remarkParse from "remark-parse"
import rehypeStringify from "rehype-stringify"
import rehypeRaw from "rehype-raw"
import { unified } from "unified"

export async function markdownToHtml(markdown: string) {
  try {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(markdown)
    return String(file)
  } catch (err) {
    throw new Error(String(err))
  }
}
