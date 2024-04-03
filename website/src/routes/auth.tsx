import { register, UserClient } from "@teamhanko/hanko-elements"
import { useNavigate } from "@solidjs/router"
import { createSignal, onMount, Show } from "solid-js"
import { getHankoCookie } from "../../../shared/auth"
import { makeEventListener } from "@solid-primitives/event-listener"
import * as gql from "../../../shared/graphql_solid"
import { Motion } from "solid-motionone"

const hankoApi = import.meta.env.VITE_HANKO_API_URL

// uses https://hanko.io authentication
// renders hanko web component: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md
// on sign up, creates a user in DB, then logs in
// on sign in, logs in user, saves token in `hanko` cookie
// also offers to save passkey or login with passkey
export default function Auth() {
	const navigate = useNavigate()
	const createUser = gql.useRequest(gql.mutation_createUser)
	const [showDeployedBranch, setShowDeployedBranch] = createSignal(
		"Deployed branch: feature/la-130-new-website-design",
	)

	onMount(() => {
		if (import.meta.env.VITE_ENV !== "staging") {
			// TODO: show tooltip with deployed branch name
			return
		}
		// if (import.meta.env.VITE_ENV !== "prod" && import.meta.env.VITE_ENV !== "staging") {
		// 	return
		// }
<<<<<<< HEAD
		// console.log(import.meta.env.VITE_CF_PAGES_BRANCH, "branch")
		// if (import.meta.env.VITE_ENV === "staging") {
		// 	// TODO: get valid token from hanko safely as a dev
		// }
=======
		console.log(import.meta.env.VITE_CF_PAGES_BRANCH, "branch")
		if (import.meta.env.VITE_ENV === "staging") {
			// TODO: get valid token from hanko safely as a dev
			setShowDeployedBranch("Deployed branch: feature/la-130-new-website-design")
		}
>>>>>>> 5aee9f4 (auth tooltip)
	})

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
				<Show when={showDeployedBranch()}>
					<Motion.div
						animate={{
							opacity: [0, 1],
							transform: [
								"translate(20px, -20px) scale(0.9)",

								"translate(0, 0) scale(1)",
							],
						}}
						class="absolute top-5 right-5 bg-hoverDark p-2 px-4 rounded-[7px] text-white/50"
					>
						{showDeployedBranch()}
					</Motion.div>
				</Show>
				<div class="">
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
				</div>
				<div class="absolute bottom-5 left-[50%] translate-x-[-50%] text-[14px] opacity-20">
					<div>Learn Anything</div>
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
