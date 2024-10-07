import { clerkClient, getAuth } from "@clerk/tanstack-start/server"
import { createServerFn } from "@tanstack/start"
import { create, get } from "ronin"
import * as cheerio from "cheerio"
import { ensureUrlProtocol } from "@/lib/utils"
import { urlSchema } from "@/lib/utils/schema"

interface Metadata {
  title: string
  description: string
  icon: string | null
  url: string
}

const DEFAULT_VALUES = {
  TITLE: "",
  DESCRIPTION: "",
  FAVICON: null,
}

export const fetchClerkAuth = createServerFn("GET", async (_, ctx) => {
  const auth = await getAuth(ctx.request)

  return {
    user: auth,
  }
})

export const getFeatureFlag = createServerFn(
  "GET",
  async (data: { name: string }) => {
    const response = await get.featureFlag.with({
      name: data.name,
    })

    return response
  },
)

export const sendFeedbackFn = createServerFn(
  "POST",
  async (data: { content: string }, { request }) => {
    const auth = await getAuth(request)
    if (!auth.userId) {
      throw new Error("Unauthorized")
    }
    const user = await clerkClient({
      telemetry: { disabled: true },
    }).users.getUser(auth.userId)
    await create.feedback.with({
      message: data.content,
      emailFrom: user.emailAddresses[0].emailAddress,
    })
  },
)

export const getMetadata = createServerFn("GET", async (url: string) => {
  if (!url) {
    return new Response('Missing "url" query parameter', {
      status: 400,
    })
  }

  const result = urlSchema.safeParse(url)
  if (!result.success) {
    throw new Error(
      result.error.issues.map((issue) => issue.message).join(", "),
    )
  }

  url = ensureUrlProtocol(url)

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()
    const $ = cheerio.load(data)

    const metadata: Metadata = {
      title:
        $("title").text() ||
        $('meta[property="og:title"]').attr("content") ||
        DEFAULT_VALUES.TITLE,
      description:
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        DEFAULT_VALUES.DESCRIPTION,
      icon:
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        DEFAULT_VALUES.FAVICON,
      url: url,
    }

    if (metadata.icon && !metadata.icon.startsWith("http")) {
      metadata.icon = new URL(metadata.icon, url).toString()
    }

    return metadata
  } catch (error) {
    console.error("Error fetching metadata:", error)
    const defaultMetadata: Metadata = {
      title: DEFAULT_VALUES.TITLE,
      description: DEFAULT_VALUES.DESCRIPTION,
      icon: DEFAULT_VALUES.FAVICON,
      url: url,
    }
    return defaultMetadata
  }
})
