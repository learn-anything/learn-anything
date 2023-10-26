import { default as Cookies } from "js-cookie"

export function getHankoCookie(): string {
  const hankoCookie = Cookies.get("hanko")
  return hankoCookie ?? ""
}

// TODO: should probably also check validity of token?
// right now it just checks that token exists but it can be expired
export function signedIn() {
  const hankoCookie = Cookies.get("hanko")
  return !!hankoCookie
}
