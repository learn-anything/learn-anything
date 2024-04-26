import { makeEventListener } from "@solid-primitives/event-listener"
import { useNavigate } from "@solidjs/router"
import { register, UserClient } from "@teamhanko/hanko-elements"
import { onMount } from "solid-js"
import { getHankoCookie } from "../../../shared/auth"
import * as gql from "../../../shared/graphql_solid"
import DevOnlyDeployedBranch from "../../components/DevOnlyDeployedBranch"

const hankoApi = import.meta.env.VITE_HANKO_API_URL

// uses https://hanko.io authentication
// renders hanko web component: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md
// on sign up, creates a user in DB, then logs in
// on sign in, logs in user, saves token in `hanko` cookie
// also offers to save passkey or login with passkey
export default function Auth() {
	const navigate = useNavigate()
	const createUser = gql.useRequest(gql.mutation_createUser)

	onMount(() => {
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
		console.log(event, "event")
		const userClient = new UserClient(hankoApi, {
			timeout: 0,
			cookieName: "hanko",
			localStorageKey: "hanko",
		})
		const user = await userClient.getCurrent()
		const email = user.email
		const res = await createUser({ email })
		if (res instanceof Error) {
			console.error("Couldn't create a user:", res)
		} else {
			console.log("New user:", res)
		}
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
					--color: rgba(255, 255, 255, 0.60);
					--color-shade-1: rgba(255, 255, 255, 0.60);
					--color-shade-2: #43464E;
					--brand-color: #AEDFFF;
					--brand-color-shade-1: #A1C9E7;
					--brand-contrast-color: #0B0D0E;
					--background-color: transparent;
					--error-color: #FF2E4C;
					--link-color: #AEDFFF;
					--font-family: "sans-serif";
					--font-size: 0.87rem;
					--font-weight: 400;
					--headline1-font-size: 0px;
					--headline1-font-weight: 600;
					--headline2-font-size: 1rem;
					--headline2-font-weight: 600;
					--border-radius: 8px;
					--item-height: 40px;
					--item-margin: 18px 0px;
					--container-padding: 0px 0px 0px 0px;
					--container-max-width: 800px;
					--headline1-margin: 0 0 1rem;
					--headline2-margin: 1rem 0 .5rem;
				}
      `}
			</style>
			<div
				class="text-white"
				style={{
					background:
						"radial-gradient(ellipse 190% 90% at top, rgba(25, 53, 92, 1) 0%, rgba(15, 15, 15, 0.8) 32%)",
					color: "white",
					display: "flex",
					"flex-direction": "column",
					"align-items": "center",
					"justify-content": "center",
				}}
			>
				<div class="flex flex-col items-center h-screen justify-center ">
					<div class="flex flex-col items-center p-10 w-[400px] bg-[#0F0F0F] rounded-lg border bg-black border-white/20">
						<div
							class="text-xl font-bold text-white/20"
							style={{
								background: "linear-gradient(#ffffff, #2358E0)",

								"background-clip": "text",
							}}
						>
							Welcome
						</div>
						<hanko-auth />
					</div>
				</div>
				<div class="absolute bottom-5 left-[50%] translate-x-[-50%] text-[14px] opacity-20">
					<div>Learn Anything</div>
				</div>
				{/* TODO: maybe move it to show in all pages in dev. (put it in app.tsx?) */}
				<DevOnlyDeployedBranch />
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
