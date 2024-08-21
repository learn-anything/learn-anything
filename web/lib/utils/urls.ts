export function isValidUrl(string: string): boolean {
	try {
		new URL(string)
		return true
	} catch (_) {
		return false
	}
}

export function isUrl(text: string): boolean {
	const pattern: RegExp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
	return pattern.test(text)
}

export function ensureUrlProtocol(url: string, defaultProtocol: string = "https://"): string {
	if (url.match(/^[a-zA-Z]+:\/\//)) {
		return url
	}

	return `${defaultProtocol}${url.startsWith("//") ? url.slice(2) : url}`
}
