// TODO: should also check if token is valid or maybe do it later time but need to do it
export function isLoggedIn(global: any) {
  if (localStorage.getItem("hanko")) {
    return true
  }
  global.set("mode", "LogInInstructions")
  return false
}
