import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
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
	FAVICON: null
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	let url = searchParams.get("url")

	await new Promise(resolve => setTimeout(resolve, 1000))

	if (!url) {
		return NextResponse.json({ error: "URL is required" }, { status: 400 })
	}

	const result = urlSchema.safeParse(url)
	if (!result.success) {
		throw new Error(result.error.issues.map(issue => issue.message).join(", "))
	}

	url = ensureUrlProtocol(url)

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
			title: $("title").text() || $('meta[property="og:title"]').attr("content") || DEFAULT_VALUES.TITLE,
			description:
				$('meta[name="description"]').attr("content") ||
				$('meta[property="og:description"]').attr("content") ||
				DEFAULT_VALUES.DESCRIPTION,
			icon: $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href") || DEFAULT_VALUES.FAVICON,
			url: url
		}

		if (metadata.icon && !metadata.icon.startsWith("http")) {
			metadata.icon = new URL(metadata.icon, url).toString()
		}

		return NextResponse.json(metadata)
	} catch (error) {
		const defaultMetadata: Metadata = {
			title: DEFAULT_VALUES.TITLE,
			description: DEFAULT_VALUES.DESCRIPTION,
			icon: DEFAULT_VALUES.FAVICON,
			url: url
		}
		return NextResponse.json(defaultMetadata)
	}
}
