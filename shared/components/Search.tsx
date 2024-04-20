import { For, Show, createEffect, createSignal } from "solid-js"
import { Motion, Presence } from "solid-motionone"
import Icon from "./Icon"
// import { Icon } from "./Icon"

interface SearchProps {
	links: { title: string; url: string }[]
	setMode: (value: string) => void
	mode: string
}

export default function Search(props: SearchProps) {
	const [isFocused, setIsFocused] = createSignal(false)
	const [focusedTimer, setFocusedTimer] = createSignal(false)
	let inputRef: any

	createEffect(() => {
		if (props.mode === "Search") {
			inputRef.focus()
		}
	})

	return (
		<div class="">
			<Motion.div
				exit={{ opacity: 0 }}
				animate={{ opacity: [0, 1] }}
				transition={{ duration: 0.4 }}
				id="backdropBlur"
				class="absolute top-0 left-0 w-full h-full bg-dark transition-all"
			></Motion.div>

			<Presence>
				<Show when={props.mode === "Search"}>
					<Motion.div
						exit={{ width: "800px", height: "56px" }}
						animate={{
							opacity: [0, 1],
							width: ["400px", "800px"],
							height: ["56px", "500px"],
						}}
						transition={{ duration: 0.3, easing: "ease-in" }}
						class="absolute top-[75px] left-[50%] translate-x-[-50%] w-full max-w-[600px] rounded-[7px] p-5 bg-[#171A21] border border-[#191919]"
					>
						<div class="col-gap-[20px]">
							<div class="text-[14px] text-white/60">Recent topics</div>
							<div class="col-gap-[6px]">
								<For each={props.links}>
									{(link) => {
										return (
											<div class="w-full py-[17px] flex-between px-[10px] bg-[#121212] hover:bg-softDark/80 transition-all rounded-[10px]">
												<div class="flex gap-[10px] items-center">
													<div class="w-[20px] h-[20px] rounded-[7px] bg-hoverDark"></div>
													{link.title}
												</div>
												<div class="-rotate-90 opacity-50">
													<Icon name="ArrowDown" />
												</div>
											</div>
										)
									}}
								</For>
							</div>
						</div>
					</Motion.div>
				</Show>
			</Presence>
			<div
				class="absolute top-3 cursor-pointer left-[50%] text-white/20 translate-x-[-50%] flex-between rounded-[10px] w-full max-w-[800px] p-[13px] px-[14px]"
				style={{
					border: "1px solid rgba(255, 255, 255, 0.10)",
					background:
						"linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.03) 100%), #191919",
					"box-shadow": "0px 4px 10px 0px rgba(0, 0, 0, 0.20)",
				}}
			>
				<div class="h-full w-full flex gap-1 items-center">
					<Icon name="Search" />
					<input
						ref={(ref) => (inputRef = ref)}
						type="text"
						class="outline-none bg-dark/0"
						onFocus={() => {
							setFocusedTimer(false)
						}}
						onBlur={() => {
							setFocusedTimer(true)
							setTimeout(() => {
								if (focusedTimer()) {
									props.setMode("Topic")
								}
							}, 500)
						}}
					/>
				</div>
			</div>
		</div>
	)
}
