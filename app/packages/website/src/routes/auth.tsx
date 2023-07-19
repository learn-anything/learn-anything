import { makeEventListener } from "@solid-primitives/event-listener"
import { onMount } from "solid-js"
import { getHankoCookie } from "../lib/auth"
import { register } from "@teamhanko/hanko-elements"
import { useNavigate } from "solid-start"

// uses https://hanko.io authentication
// https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md
export default function SignInPage() {
  const navigate = useNavigate()
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
      // navigate("/")
    }

    // register hanko component
    register(import.meta.env.VITE_HANKO_API, {
      shadow: true, // can use https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md#css-shadow-parts
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
      // navigate("/")
    },
    { passive: true }
  )

  return (
    <>
      <style>
        {`
          #Auth:hover {
            transform: translateY(-4px);
            transition: all 0.3s linear;
          }
          #Auth {
            transition: all 0.3s linear
          }
          #text {
            padding-top: 10px;
            opacity: 0.7;
            font-weight: bold;
          }
          hanko-auth, hanko-profile {
            --color: #000000;
            --color-shade-1: #989BA1;
            --color-shade-2: #43464E;
            --brand-color: #AEDFFF;
            --brand-color-shade-1: #A1C9E7;
            --brand-contrast-color: #0B0D0E;
            --background-color: transparent;
            --error-color: #FF2E4C;
            --link-color: #AEDFFF;
            --font-family: "Inter";
            --font-size: 1rem;
            --font-weight: 400;
            --headline1-font-size: 0px;
            --headline1-font-weight: 600;
            --headline2-font-size: 1rem;
            --headline2-font-weight: 600;
            --border-radius: 8px;
            --item-height: 40px;
            --item-margin: 18px 0px;
            --container-padding: 20px 50px 50px 50px;
            --container-max-width: 800px;
            --headline1-margin: 0 0 1rem;
            --headline2-margin: 1rem 0 .5rem;

          }
        }
        `}
      </style>
      <div class="absolute flex items-center justify-center top-0 right-0 z-40 w-screen h-screen bg-slate-100 dark:bg-neutral-950">
        <div class="rounded-3xl bg-white p-5 flex items-center justify-center flex-col gap-5 border-slate-400 border-opacity-70 border">
          {/* TODO: types.d.ts not helping solve type error, maybe wrong place for the file? */}
          {/* TODO: there is also CORS issue */}
          {/* hanko-auth element does not render */}
          <hanko-auth />
        </div>
      </div>
    </>
  )
}
