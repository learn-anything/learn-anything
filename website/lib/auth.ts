export function getHankoCookie() {
  const allCookies = document.cookie
  const hankoCookie = allCookies
    .split(";")
    .find((cookie) => {
      return cookie
    })
    ?.split("=")[1]
  return hankoCookie
}

export function signedIn() {
  const allCookies = document.cookie
  const hankoCookie = allCookies
    .split(";")
    .find((cookie) => {
      return cookie
    })
    ?.split("=")[1]
  if (hankoCookie) {
    return true
  }
  return false
}
