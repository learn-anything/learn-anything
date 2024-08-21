/*
 * This file contains custom schema definitions for Zod.
 */

import { z } from "zod"

export const customUrlSchema = z.string().refine(
	value => {
		const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

		const isValidDomain = (domain: string) => {
			try {
				// Use URL constructor to handle Punycode
				const url = new URL(`http://${domain}`)
				return domainRegex.test(url.hostname)
			} catch {
				return false
			}
		}

		if (isValidDomain(value)) {
			return true
		}

		try {
			const url = new URL(value)

			if (!url.protocol.match(/^https?:$/)) {
				return false
			}

			return isValidDomain(url.hostname)
		} catch {
			return false
		}
	},
	{
		message: "Invalid URL format. Please provide a valid domain or a full URL with http:// or https:// protocol."
	}
)
