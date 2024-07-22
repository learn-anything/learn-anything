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

export function isUrl(text: string): boolean {
  const pattern: RegExp =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  return pattern.test(text)
}

export function ensureUrlProtocol(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  return `https://${url}`
}

export const randomId = () => {
  return Math.random().toString(36).substring(7)
}
