import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"

interface Metadata {
  title: string
  description: string
  image: string | null
  favicon: string
  url: string
}

const DEFAULT_VALUES = {
  TITLE: "No title available",
  DESCRIPTION: "No description available",
  IMAGE: null,
  FAVICON: process.env.NEXT_PUBLIC_APP_URL + "/default-favicon.ico"
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const { data } = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    })

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
      image:
        $('meta[property="og:image"]').attr("content") || DEFAULT_VALUES.IMAGE,
      favicon:
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        DEFAULT_VALUES.FAVICON,
      url: url
    }

    if (metadata.image && !metadata.image.startsWith("http")) {
      metadata.image = new URL(metadata.image, url).toString()
    }
    if (metadata.favicon && !metadata.favicon.startsWith("http")) {
      metadata.favicon = new URL(metadata.favicon, url).toString()
    }

    return NextResponse.json(metadata)
  } catch (error) {
    const defaultMetadata: Metadata = {
      title: DEFAULT_VALUES.TITLE,
      description: DEFAULT_VALUES.DESCRIPTION,
      image: DEFAULT_VALUES.IMAGE,
      favicon: new URL(DEFAULT_VALUES.FAVICON, url).toString(),
      url: url
    }
    return NextResponse.json(defaultMetadata)
  }
}
