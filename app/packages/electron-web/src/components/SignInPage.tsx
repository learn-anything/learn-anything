import { onMount } from "solid-js"
import { getHankoCookie } from "../lib/auth"
import { register } from "@teamhanko/hanko-elements"

export default function SignInPage() {
  onMount(async () => {
    console.log(import.meta.env.VITE_HANKO_API, "HELLLO")
    // TODO: check if there is a valid token, if token is valid go to /
    // TODO: can change to use https://github.com/teamhanko/hanko/tree/main/frontend/frontend-sdk
    // i.e. call https://github.com/teamhanko/hanko/tree/main/frontend/frontend-sdk#get-the-current-user--validate-the-jwt-against-the-hanko-api
    // TODO: make that hanko api url into VITE env!
    const res = await fetch(`${import.meta.env.VITE_HANKO_API}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getHankoCookie()}`,
      },
    })

    if (res.status === 200) {
      // navigate("/")
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
          <div>Sign in</div>
          <hanko-auth
            api={"https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io"}
          />
          <input
            type="text"
            placeholder="Sign in"
            class="w-full p-1 px-4 border rounded-md bg-transparent border-slate-400 border-opacity-50"
          />
        </div>
      </div>
    </>
  )
}
