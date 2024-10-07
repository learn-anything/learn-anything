/*
 * This file contains custom schema definitions for Zod.
 */

import { z } from "zod"

export const urlSchema = z
  .string()
  .min(1, { message: "URL can't be empty" })
  .refine(
    (value) => {
      const domainRegex =
        /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

      const isValidDomain = (domain: string) => {
        try {
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
      message: "Please enter a valid URL",
    },
  )
