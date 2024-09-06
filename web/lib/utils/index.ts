import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const randomId = () => {
	return Math.random().toString(36).substring(7)
}

function escapeRegExp(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export const searchSafeRegExp = (inputValue: string) => {
	const escapedChars = inputValue.split("").map(escapeRegExp)
	return new RegExp(escapedChars.join(".*"), "i")
}

export * from "./urls"
export * from "./slug"
export * from "./keyboard"
