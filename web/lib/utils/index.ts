import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const randomId = () => {
  return Math.random().toString(36).substring(7)
}

export * from "./urls"
export * from "./slug"
