import { makeEventListener } from "@solid-primitives/event-listener"
import { onMount } from "solid-js"
import { register } from "@teamhanko/hanko-elements"
import { UserClient } from "@teamhanko/hanko-frontend-sdk"
// @ts-ignore
import { useNavigate } from "solid-start"
import { useUser } from "../GlobalContext/user"
import { getHankoCookie } from "@la/shared/lib"

// uses https://hanko.io authentication
// it renders hanko web components: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md
// on sign up, creates a user in DB or logs in if user already exists
export default function SignInPage() {
  const navigate = useNavigate()
  // const signIn = useSignIn()
  // const mobius = useMobius()
  const userStore = useUser()

  onMount(async () => {
    // checks if user is already logged in with valid token
    const res = await fetch(`${import.meta.env.VITE_HANKO_API}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getHankoCookie()}`,
      },
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
      injectStyles: true,
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
        localStorageKey: "hanko",
      })
      const user = await userClient.getCurrent()
      const email = user.email

      const hankoCookie = await getHankoCookie()
      // doing this so that below GraphQL query can work, it supplies `mobius` client with the hanko token
      // signIn(hankoCookie)

      // await mobius.mutate({
      //   createUser: {
      //     where: {
      //       email: email
      //     },
      //     select: true
      //   }
      // })
      // userStore.setSignedIn(true)
      // userStore.setEmail(email)
      // TODO: do it as part of `createUser`. have `createUser` return `isMember` in case user exists
      // and is member
      // const res = await mobius.query({
      //   getUserDetails: {
      //     isMember: true
      //   }
      // })
      // if (res) {
      //   // @ts-ignore
      //   userStore.set({ member: res?.data?.getUserDetails.isMember })
      // }
      const route = localStorage.getItem("pageBeforeSignIn")
      if (route) {
        localStorage.setItem("pageBeforeSignIn", "")
        navigate(route)
      } else {
        navigate("/")
      }
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
          --background-color: black;
          --error-color: #FF2E4C;
          --link-color: #AEDFFF;
          --font-family: "Raleway";
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
      `}
      </style>
      <div class="text-white bg-neutral-950">
        <div class="">
          <div class="flex flex-col items-center h-screen justify-center ">
            <div class="flex flex-col items-center p-10 rounded-lg border bg-black border-gray-200">
              <div class="text-xl font-bold">Sign in / up with</div>
              {/* @ts-ignore */}
              <hanko-auth />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
