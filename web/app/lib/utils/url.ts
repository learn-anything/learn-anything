export function ensureUrlProtocol(
  url: string,
  defaultProtocol: string = "https://",
): string {
  if (url.match(/^[a-zA-Z]+:\/\//)) {
    return url
  }

  return `${defaultProtocol}${url.startsWith("//") ? url.slice(2) : url}`
}
