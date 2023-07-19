export async function getHankoCookie() {
  const allCookies = document.cookie
  const hankoCookie = allCookies
    .split(";")
    .find((cookie) => {
      return cookie
    })
    ?.split("=")[1]
  return hankoCookie
}
