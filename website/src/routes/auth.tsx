import { register, Hanko, UserClient } from "@teamhanko/hanko-elements"
import { useNavigate } from "@solidjs/router"
import { onCleanup, onMount } from "solid-js"
import { getHankoCookie } from "../../../shared/auth"
import { makeEventListener } from "@solid-primitives/event-listener"
import * as gql from "../../../shared/graphql_client"

const hankoApi = import.meta.env.VITE_HANKO_API_URL

// uses https://hanko.io authentication
// renders hanko web component: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md
// on sign up, creates a user in DB, then logs in
// on sign in, logs in user, saves token in `hanko` cookie
// also offers to save passkey or login with passkey
export default function Auth() {
	const navigate = useNavigate()
	const createUser = gql.useRequest(gql.mutation_updatePersonalLink)

	onMount(async () => {
		// TODO: improve this to actually validate that hanko cookie is valid, if not, have users go through auth again
		if (getHankoCookie()) {
			navigate("/")
		}
		register(hankoApi, {
			shadow: true, // if true, can use this for styling: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md#css-shadow-parts
			injectStyles: true, // TODO: check if needed
		}).catch((error) => {
			console.error({ error })
		})
	})
	makeEventListener(document, "hankoAuthSuccess", async (event) => {
		const userClient = new UserClient(hankoApi, {
			timeout: 0,
			cookieName: "hanko",
			localStorageKey: "hanko",
		})
		const user = await userClient.getCurrent()
		const email = user.email
		console.log(email, "email")
	})

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
							<hanko-auth />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

type GlobalJsx = JSX.IntrinsicElements

declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			"hanko-auth": GlobalJsx["hanko-auth"]
		}
	}
}
