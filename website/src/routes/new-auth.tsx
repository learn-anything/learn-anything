import { register, Hanko } from "@teamhanko/hanko-elements"
import { useNavigate } from "@solidjs/router"
import { onCleanup, onMount } from "solid-js"

const hankoApi = import.meta.env.VITE_HANKO_API_URL

export default function NewAuth() {
	const navigate = useNavigate()
	const hanko = new Hanko(hankoApi)

	const redirectAfterLogin = () => {
		navigate("/dashboard")
	}

	onMount(() => {
		hanko.onAuthFlowCompleted(() => {
			redirectAfterLogin()
		})

		register(hankoApi).catch((error) => {
			// handle error
		})
	})

	onCleanup(() => {
		// cleanup logic if needed
	})

	return (
		<div class="w-screen h-screen flex-center ">
			<hanko-auth />
			<div class="border border-[#191919] p-[30px] py-[50px] rounded-[7px] w-[400px] bg-[#0F0F0F] col-gap-[40px]">
				<div class="text-[25px] text-center w-full">Welcome</div>
				<div class="col-gap-[16px]">
					<input
						type="text"
						style={{
							background:
								"linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.03) 100%), #191919",
							"box-shadow": "0px 4px 10px 0px rgba(0, 0, 0, 0.20)",
						}}
						placeholder="Enter Email"
						class="border w-full outline-none p-[14px] rounded-[7px] text-center text-white/30 text-[14px] border-white/10"
					/>
					<div class="w-full text-center text-[14px] text-white/40">or</div>
					<div
						style={{
							background:
								"linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.03) 100%), #191919",
							"box-shadow": "0px 4px 10px 0px rgba(0, 0, 0, 0.20)",
						}}
						class="border w-full outline-none p-[14px] rounded-[7px] text-center text-white/30 text-[14px] border-white/10"
					>
						Sign in with passkey
					</div>
				</div>
			</div>
			<div class="absolute bottom-10 left-[50%] translate-x-[-50%] text-[14px] text-white/30">
				<div>Learn Anything</div>
				<div></div>
			</div>
		</div>
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
