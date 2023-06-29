import { makeEventListener } from "@solid-primitives/event-listener"
import { register } from "@teamhanko/hanko-elements"
import { onMount } from "solid-js"
import { useNavigate } from "solid-start"
import { getHankoCookie } from "~/lib/auth"

export default function Auth() {
  const navigate = useNavigate()

  onMount(async () => {
    // if authorised, redirect to home
    const res = await fetch(`${import.meta.env.VITE_HANKO_API}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getHankoCookie()}`,
      },
    })
    // if (res.status === 200) {
    //   navigate("/")
    // }

    // register hanko component
    register(import.meta.env.VITE_HANKO_API)
  })

  makeEventListener(
    document,
    "hankoAuthSuccess",
    async (e) => {
      navigate("/")
    },
    { passive: true }
  )

  return (
    <>
      <div class="bg-white dark:bg-neutral-950 h-screen w-screen flex items-center justify-center">
        <hanko-auth />
      </div>
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
          border: solid 2px rgba(150,150,150,0.3);
          padding: 8px;
          border-radius: 25px;
          --color: black;
          --color-shade-1: #989BA1;
          --color-shade-2: rgba(234,234,234,0.8);
          --brand-color: black;
          --brand-color-shade-1: rgba(34,34,34, 0.8);
          --brand-contrast-color: white;
          --background-color: white;
          --error-color: #FF2E4C;
          --link-color: black;
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
          --container-padding: 20px 50px 25px 50px;
          --container-max-width: 800px;
          --headline1-margin: 0 0 1rem;
          --headline2-margin: 1rem 0 .5rem;
        }
        @media (prefers-color-scheme: dark) {
          hanko-auth, hanko-profile {
            border: solid 2px rgba(150,150,150,0.3);
            padding: 8px;
            border-radius: 25px;
            --color: #fff;
            --color-shade-1: #989BA1;
            --color-shade-2: #43464E;
            --brand-color: #AEDFFF;
            --brand-color-shade-1: #A1C9E7;
            --brand-contrast-color: #0B0D0E;
            --background-color: rgb(10,10,10);
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
    </>
  )
}
