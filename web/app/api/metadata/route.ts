import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import cheerio from "cheerio"

interface Metadata {
  title: string
  description: string
  image: string | null
  favicon: string
  url: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  console.log("request", request)
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
        "No title available",
      description:
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        "test", // TODO: does not show
      image: $('meta[property="og:image"]').attr("content") || null,
      favicon:
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        "/default-favicon.ico",
      url: url
    }

    // Ensure absolute URLs for image and favicon
    if (metadata.image && !metadata.image.startsWith("http")) {
      metadata.image = new URL(metadata.image, url).toString()
    }
    if (metadata.favicon && !metadata.favicon.startsWith("http")) {
      metadata.favicon = new URL(metadata.favicon, url).toString()
    }

    return NextResponse.json(metadata)
  } catch (error) {
    // console.error("Error fetching metadata:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch metadata",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
