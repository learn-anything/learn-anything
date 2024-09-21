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

export const isEditableElement = (element: HTMLElement): boolean => {
	if (element.isContentEditable) {
		return true
	}

	const tagName = element.tagName.toLowerCase()
	const editableTags = ["input", "textarea", "select", "option"]

	if (editableTags.includes(tagName)) {
		return true
	}

	const role = element.getAttribute("role")
	const editableRoles = ["textbox", "combobox", "listbox"]

	return role ? editableRoles.includes(role) : false
}

export * from "./urls"
export * from "./slug"
export * from "./keyboard"
export * from "./htmlLikeElementUtil"
