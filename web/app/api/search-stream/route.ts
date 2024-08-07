import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	let data: unknown
	try {
		data = (await request.json()) as unknown
	} catch (error) {
		return new NextResponse("Invalid JSON", { status: 400 })
	}

	if (typeof data !== "object" || !data) {
		return new NextResponse("Missing request data", { status: 400 })
	}

	if (!("question" in data) || typeof data.question !== "string") {
		return new NextResponse("Missing `question` data field.", { status: 400 })
	}

	const chunks: string[] = [
		"# Hello",
		" from th",
		"e server",
		"\n\n your question",
		" was:\n\n",
		"> ",
		data.question,
		"\n\n",
		"**good bye!**"
	]

	const stream = new ReadableStream<string>({
		async start(controller) {
			for (const chunk of chunks) {
				controller.enqueue(chunk)
				await new Promise(resolve => setTimeout(resolve, 1000))
			}

			controller.close()
		}
	})

	return new NextResponse(stream)
}
