import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function ensureUrlProtocol(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  return `https://${url}`
}

export interface Metadata {
  title: string
  description: string
  image: string | null
  favicon: string
  url: string
}

export async function fetchMetadata(url: string): Promise<Metadata> {
  const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`)
  if (!res.ok) {
    throw new Error("Failed to fetch metadata")
  }
  return res.json()
}
