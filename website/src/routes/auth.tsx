import { makeEventListener } from "@solid-primitives/event-listener"
import { onMount } from "solid-js"
import { register } from "@teamhanko/hanko-elements"
import { UserClient } from "@teamhanko/hanko-frontend-sdk"
import { useNavigate } from "solid-start"
import { getHankoCookie } from "../../lib/auth"
import { useMobius, useSignIn } from "../root"
import { useUser } from "../GlobalContext/user"

// uses https://hanko.io authentication
// it renders hanko web components: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md
// on sign up, creates a user in DB or logs in if user already exists
export default function SignInPage() {
  const navigate = useNavigate()
  const signIn = useSignIn()
  const mobius = useMobius()
  const userStore = useUser()

  onMount(async () => {
    // checks if user is already logged in with valid token
    const res = await fetch(`${import.meta.env.VITE_HANKO_API}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getHankoCookie()}`
      }
    })
    // if status 200, means user is logged in, navigate to using the app
    if (res.status === 200) {
      const route = localStorage.getItem("pageBeforeSignIn")
      if (route) {
        localStorage.setItem("pageBeforeSignIn", "")
        navigate(route)
      } else {
        navigate("/")
      }
    }

    // register hanko component
    register(import.meta.env.VITE_HANKO_API, {
      shadow: true, // if true, can use this for styling: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md#css-shadow-parts
      injectStyles: true
    }).catch(async (error) => {
      console.error(error, "error")
    })
  })

  makeEventListener(
    document,
    "hankoAuthSuccess",
    async () => {
      const userClient = new UserClient(import.meta.env.VITE_HANKO_API, {
        timeout: 0,
        cookieName: "hanko",
        localStorageKey: "hanko"
      })
      const user = await userClient.getCurrent()
      const email = user.email

      const allCookies = document.cookie
      const hankoCookie = allCookies
        .split(";")
        .find((cookie) => {
          return cookie
        })
        ?.split("=")[1]
      // doing this so that below GraphQL query can work, it supplies `mobius` client with the hanko token
      signIn(hankoCookie!)

      await mobius.mutate({
        createUser: {
          where: {
            email: email
          },
          select: true
        }
      })
      userStore.setSignedIn(true)
      userStore.setEmail(email)
      const route = localStorage.getItem("pageBeforeSignIn")
      if (route) {
        localStorage.setItem("pageBeforeSignIn", "")
        navigate(route)
      } else {
        navigate("/")
      }
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
          --color: #fff;
          --color-shade-1: #989BA1;
          --color-shade-2: #43464E;
          --brand-color: #AEDFFF;
          --brand-color-shade-1: #A1C9E7;
          --brand-contrast-color: #0B0D0E;
          --background-color: #070c19;
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
          "background-color": "#02050e"
        }}
      >
        <div
          style={{
            "background-image": "url('./blue-left.svg')",
            "background-size": "cover"
          }}
        >
          <div
            style={{
              "background-image": "url('./blue-right.svg')",
              "background-size": "cover"
            }}
            class="flex flex-col items-center h-screen justify-center text-white"
          >
            <div
              style={{
                border: "solid 1px rgba(13, 19, 39, 0.5)",
                "background-image": `linear-gradient(
                  34deg in oklab,
                  rgb(1% 2% 5% / 86%) 0%, rgb(7, 12, 25) 50%, rgb(1% 2% 5% / 86%) 100%
                )`
              }}
              class="flex flex-col items-center p-10 rounded-lg border-2 border-neutral-900"
            >
              <div id="text" class="text-2xl mt-3 mb-2">
                Sign in/up with
              </div>
              {/* @ts-ignore */}
              <hanko-auth />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
