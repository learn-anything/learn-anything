// TODO: maybe not needed? part of hanko sdk?
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
