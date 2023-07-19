import { makeEventListener } from "@solid-primitives/event-listener"
import { onMount } from "solid-js"
import { getHankoCookie } from "../lib/auth"
import { register } from "@teamhanko/hanko-elements"
import { createUserState } from "../GlobalContext/user"

// uses https://hanko.io authentication
// https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md
export default function SignInPage() {
  const user = createUserState()
  onMount(async () => {
    console.log(import.meta.env.VITE_HANKO_API, "hanko api")

    // checks if user is already logged in with valid token
    // TODO: perhaps there is better way to do this?
    const res = await fetch(`${import.meta.env.VITE_HANKO_API}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getHankoCookie()}`,
      },
    })
    // if status 200, means user is logged in
    // navigate to using the app
    if (res.status === 200) {
      user.setShowSignIn(false)
    }

    // register hanko component
    register(import.meta.env.VITE_HANKO_API, {
      shadow: true,
      injectStyles: true,
    }).catch(async (error) => {
      // TODO: log with Tinybird
      console.log(error, "error")
    })
  })

  makeEventListener(
    document,
    "hankoAuthSuccess",
    async (e) => {
      console.log(e, "hanko auth success event")
      // auth success, navigate to using app
      user.setShowSignIn(true)
    },
    { passive: true }
  )

  return (
    <>
      <style>
        {`
        `}
      </style>
      <div class="absolute flex items-center justify-center top-0 right-0 z-40 w-screen h-screen bg-slate-100 dark:bg-neutral-950">
        <div class="rounded-lg p-5 flex items-center justify-center flex-col gap-5 border-slate-400 border-opacity-50 border">
          {/* TODO: types.d.ts not helping solve type error, maybe wrong place for the file? */}
          {/* TODO: there is also CORS issue */}
          {/* hanko-auth element does not render */}
          <hanko-auth />
        </div>
      </div>
    </>
  )
}
