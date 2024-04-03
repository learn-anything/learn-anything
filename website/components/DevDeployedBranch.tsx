import { Show, createSignal, onMount } from "solid-js"
import { Motion } from "solid-motionone"

// TODO: make `Deployed branch: {deployedBranch()}` link to branch name / PR on GitHub
export default function DevDeployedBranch() {
	const [deployedBranch, setShowDeployedBranch] = createSignal("")

	onMount(() => {
		if (import.meta.env.VITE_ENV === "dev" || true) {
			setShowDeployedBranch("Deployed branch: feature/la-130-new-website-design")
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
				Deployed branch: {deployedBranch()}
			</Motion.div>
		</Show>
	)
}
