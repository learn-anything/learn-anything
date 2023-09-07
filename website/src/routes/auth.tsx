import { makeEventListener } from "@solid-primitives/event-listener"
import { onMount } from "solid-js"
import { register } from "@teamhanko/hanko-elements"
import { useNavigate } from "solid-start"
import { getHankoCookie } from "../../lib/auth"
import { useSignIn } from "../root"

// uses https://hanko.io authentication
// https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md
export default function SignInPage() {
  const navigate = useNavigate()

  const signIn = useSignIn()

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
      // TODO: should come from event, check
      // don't do below
      console.log(e, "e")

      const allCookies = document.cookie
      const hankoCookie = allCookies
        .split(";")
        .find((cookie) => {
          return cookie
        })
        ?.split("=")[1]

      signIn(hankoCookie!)
      navigate("/")
    },
    { passive: true },
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
          --color: #fff;
          --color-shade-1: #989BA1;
          --color-shade-2: #43464E;
          --brand-color: #AEDFFF;
          --brand-color-shade-1: #A1C9E7;
          --brand-contrast-color: #0B0D0E;
          --background-color: transparent;
          --error-color: #FF2E4C;
          --link-color: #AEDFFF;
          --font-family: "IBM Plex Sans";
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
      <div
        style={{
          "background-color": "#02050e",
        }}
      >
        <div
          style={{
            "background-image": "url('./blue-left.svg')",
            "background-size": "cover",
          }}
        >
          <div
            style={{
              "background-image": "url('./blue-right.svg')",
              "background-size": "cover",
            }}
            class="flex flex-col items-center h-screen justify-center text-white"
          >
            <div
              style={{
                border: "solid 1px rgba(13, 19, 39, 0.5)",
                "background-image": `linear-gradient(
                  34deg in oklab,
                  rgb(1% 2% 5% / 86%) 0%, rgb(7, 12, 25) 50%, rgb(1% 2% 5% / 86%) 100%
                )`,
              }}
              class="flex flex-col items-center p-10 rounded-lg border-2 border-neutral-900"
            >
              {/* TODO: make logo look good in dark theme */}
              {/* <img
                style={{
                  "border-radius": "25px",
                  border: "2.5px solid black",
                  width: "90px",
                  height: "90px",
                }}
                src="./logo.jpg"
              /> */}
              <div id="text" class="text-2xl mt-3 mb-2">
                Sign in/up with
              </div>
              {/* TODO: types.d.ts not helping solve type error, maybe wrong place for the file? */}
              {/* TODO: there is also CORS issue */}
              {/* hanko-auth element does not render */}
              {/* @ts-ignore */}
              <hanko-auth />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
