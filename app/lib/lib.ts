import { useGlobalState } from "../src/GlobalContext/global"

// TODO: should also check if token is valid or maybe do it later time but need to do it
export function isLoggedIn() {
  const global = useGlobalState()
  if (localStorage.getItem("hanko")) {
    return true
  }
  global.set("showModal", "needToLoginInstructions")
  return false
}
