import { default as Cookies } from "js-cookie"

export function getHankoCookie(): string {
  const hankoCookie = Cookies.get("hanko")
  return hankoCookie ?? ""
}

export function signedIn() {
  const hankoCookie = Cookies.get("hanko")
  return !!hankoCookie
}
