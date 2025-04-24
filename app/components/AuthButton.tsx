import { useAccount, usePasskeyAuth } from "jazz-react"

export function AuthButton() {
  const { logOut } = useAccount()

  const auth = usePasskeyAuth({
    appName: "PrePrompt",
  })

  function handleLogOut() {
    logOut()
    window.history.pushState({}, "", "/")
  }

  if (auth.state === "signedIn") {
    return (
      <button
        className="bg-stone-100/50 py-1.5 px-3 text-sm rounded-md"
        onClick={handleLogOut}
      >
        Log out
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        className="bg-stone-100/50 py-1.5 px-3 text-sm rounded-md"
        onClick={() => auth.signUp("")}
      >
        Sign up
      </button>
      <button
        onClick={() => auth.logIn()}
        className="bg-stone-100/50 py-1.5 px-3 text-sm rounded-md"
      >
        Log in
      </button>
    </div>
  )
}
