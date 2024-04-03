import { Show, createSignal, onMount } from "solid-js"
import { Motion } from "solid-motionone"

export default function DevDeployedBranch() {
	const [deployedBranch, setShowDeployedBranch] = createSignal("")

	onMount(() => {
		if (import.meta.env.VITE_ENV === "dev" && import.meta.env.VITE_CF_PAGES_BRANCH) {
			setShowDeployedBranch(import.meta.env.VITE_CF_PAGES_BRANCH)
			return
		}
	})

	return (
		<Show when={deployedBranch()} fallback={<></>}>
			<Motion.div
				animate={{
					opacity: [0, 1],
					transform: ["translate(20px, -20px) scale(0.9)", "translate(0, 0) scale(1)"],
				}}
				class="absolute top-5 right-5 bg-hoverDark p-2 px-4 rounded-[7px] text-white/50"
			>
				<a href={`https://github.com/learn-anything/learn-anything.xyz/pull/${deployedBranch()}`}>
					Deployed branch: {deployedBranch()}
				</a>
			</Motion.div>
		</Show>
	)
}
