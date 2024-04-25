import { Show, createSignal, onMount } from "solid-js"
import { Motion } from "solid-motionone"

// only available in `dev` env
export default function DevOnlyDeployedBranch() {
	if (
		!(
			import.meta.env.VITE_ENV === "dev" && import.meta.env.VITE_CF_PAGES_BRANCH
		)
	) {
		return <></>
	}
	const [isVisible, setIsVisible] = createSignal(true)
	onMount(() => {
		setTimeout(() => {
			setIsVisible(false)
		}, 4000)
	})

	return (
		<Show when={isVisible()} fallback={<></>}>
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
				<a
					href={`https://github.com/learn-anything/learn-anything.xyz/pull/${
						import.meta.env.VITE_CF_PAGES_BRANCH
					}`}
				>
					Deployed branch: {import.meta.env.VITE_CF_PAGES_BRANCH}
				</a>
			</Motion.div>
		</Show>
	)
}
