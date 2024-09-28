import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const randomId = () => {
	return Math.random().toString(36).substring(7)
}

export const toTitleCase = (str: string): string => {
	return str
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, str => str.toUpperCase())
		.trim()
}

function escapeRegExp(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export const searchSafeRegExp = (inputValue: string) => {
	const escapedChars = inputValue.split("").map(escapeRegExp)
	return new RegExp(escapedChars.join(".*"), "i")
}

export function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array]
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	return shuffled
}

const inputs = ["input", "select", "button", "textarea"] // detect if node is a text input element

export function isTextInput(element: Element): boolean {
	return !!(
		element &&
		element.tagName &&
		(inputs.indexOf(element.tagName.toLowerCase()) !== -1 ||
			element.attributes.getNamedItem("role")?.value === "textbox" ||
			element.attributes.getNamedItem("contenteditable")?.value === "true")
	)
}

export function calendarFormatDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	})
}

export * from "./urls"
export * from "./slug"
export * from "./keyboard"
export * from "./htmlLikeElementUtil"
