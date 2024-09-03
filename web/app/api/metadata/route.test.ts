/**
 * @jest-environment node
 */
import { NextRequest } from "next/server"
import axios from "axios"
import { GET } from "./route"

const DEFAULT_VALUES = {
	TITLE: "",
	DESCRIPTION: "",
	FAVICON: null
}

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("Metadata Fetcher", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("should return metadata when URL is valid", async () => {
		const mockHtml = `
      <html>
        <head>
          <title>Test Title</title>
          <meta name="description" content="Test Description">
          <link rel="icon" href="/icon.ico">
        </head>
      </html>
    `

		mockedAxios.get.mockResolvedValue({ data: mockHtml })

		const req = {
			url: process.env.NEXT_PUBLIC_APP_URL + "/api/metadata?url=https://example.com"
		} as unknown as NextRequest

		const response = await GET(req)
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data).toEqual({
			title: "Test Title",
			description: "Test Description",
			icon: "https://example.com/icon.ico",
			url: "https://example.com"
		})
	})

	it("should return an error when URL is missing", async () => {
		const req = {
			url: process.env.NEXT_PUBLIC_APP_URL + "/api/metadata"
		} as unknown as NextRequest

		const response = await GET(req)
		const data = await response.json()

		expect(response.status).toBe(400)
		expect(data).toEqual({ error: "URL is required" })
	})

	it("should return default values when fetching fails", async () => {
		mockedAxios.get.mockRejectedValue(new Error("Network error"))

		const req = {
			url: process.env.NEXT_PUBLIC_APP_URL + "/api/metadata?url=https://example.com"
		} as unknown as NextRequest

		const response = await GET(req)
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data).toEqual({
			title: DEFAULT_VALUES.TITLE,
			description: DEFAULT_VALUES.DESCRIPTION,
			icon: null,
			url: "https://example.com"
		})
	})

	it("should handle missing metadata gracefully", async () => {
		const mockHtml = `
      <html>
        <head>
        </head>
      </html>
    `

		mockedAxios.get.mockResolvedValue({ data: mockHtml })

		const req = {
			url: process.env.NEXT_PUBLIC_APP_URL + "/api/metadata?url=https://example.com"
		} as unknown as NextRequest

		const response = await GET(req)
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data).toEqual({
			title: DEFAULT_VALUES.TITLE,
			description: DEFAULT_VALUES.DESCRIPTION,
			icon: null,
			url: "https://example.com"
		})
	})
})
