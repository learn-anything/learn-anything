import { onMount } from "solid-js"
import { getHankoCookie } from "../lib/auth"
import { register } from "@teamhanko/hanko-elements"
import { createUserState } from "../GlobalContext/user"

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
    if (res.status === 200) {
      user.setShowSignIn(false)
    }

    // register hanko component
    // https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md#script
    register({ shadow: true, injectStyles: true }).catch(async (error) => {
      console.log(error, "error")
    })
  })

  return (
    <>
      <style>
        {`
        `}
      </style>
      <div class="absolute flex items-center justify-center top-0 right-0 z-40 w-screen h-screen bg-neutral-950">
        <div class="rounded-lg p-5 flex items-center justify-center flex-col gap-5 border-slate-400 border-opacity-50 border">
          <hanko-auth />
          {/* <div>Sign in</div> */}
          {/* <input
            type="text"
            placeholder="Sign in"
            class="w-full p-1 px-4 border rounded-md bg-transparent border-slate-400 border-opacity-50"
          /> */}
        </div>
      </div>
    </>
  )
}
