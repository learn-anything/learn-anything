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
    { passive: true },
  )

  return (
    <>
      <style>
        {`
        hanko-auth::part(container) {
          background: inherit;
        }
        hanko-auth::part(input) {
          border: solid 1px rgba(148, 163, 184, 0.3);
          background: inherit;
          border-radius: 8px;
          transition: all 0.2s linear;
          padding-left: 15px;
          font-weight: 600;
          font-size: 13.5px;

        }
        hanko-auth::part(input):hover {
          border: solid 1px rgba(148, 163, 184, 0.5);

        }
        hanko-auth::part(input):focus {
          border: solid 1px rgba(148, 163, 184, 1);

        }
        hanko-auth::part(form-item) {
          width: 200px;


        }
        hanko-auth::part(divider) {
          padding-top: 10px;
          padding-bottom: 10px;


        }
        hanko-auth::part(button) {
          width: 300px;
          background: black;
          font-weight: 800;
          color: white;
          border: none;
          border-radius: 8px;
          transition: all 0.2s linear;
        }
        hanko-auth::part(button):hover {
          opacity: 0.8;
        }
        hanko-auth::part(headline1) {
         font-size: 14px;
         opacity: 0.5;
         font-weight: 600;
         padding-left: 2px;
        }
        hanko-auth::part(divider-text) {
          background: inherit;
        }
        hanko-auth::part(secondary-button) {
          background: inherit;
          border: solid 1px rgba(148, 163, 184, 0.7);
          transition: all 0.2s linear;
          border-radius: 8px;
          color: rgba(40 ,40, 40, 0.8);


        }

        hanko-auth::part(secondary-button):hover {
          background: rgba(148, 163, 184, 0.2);
          border: solid 1px rgba(148, 163, 184, 1);
        }
        #SignInPage {
          background-image: url("../public/gradient-light.png");
          background-size: cover;
          background-position: center;
        }
        `}
      </style>
      <div
        id="SignInPage"
        class="absolute flex items-center justify-center top-0 right-0 z-40 w-screen h-screen bg-slate-100 dark:bg-neutral-950"
      >
        <div class="rounded-3xl p-7 flex py-10 drop-shadow-xl bg-white bg-opacity-50 flex-col gap-5 border-slate-400 border-opacity-20 border-2">
          {/* TODO: types.d.ts not helping solve type error, maybe wrong place for the file? */}
          {/* TODO: there is also CORS issue */}
          {/* hanko-auth element does not render */}
          {/* @ts-ignore */}
          <div class="font-bold text-xl">Welcome to Learn Anything</div>

          <hanko-auth />
        </div>
      </div>
    </>
  )
}
