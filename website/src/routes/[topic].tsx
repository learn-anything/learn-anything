import { For, Show, createSignal } from "solid-js"
import Button from "../../../shared/components/Button"
import { Motion } from "solid-motionone"

export default function Topic() {
	return (
		<div class="ml-[200px] p-3 h-screen">
			<Sidebar />
			<div class=" border border-[#191919] rounded-[7px] h-full">
				<div>
					<div>Title</div>
				</div>
			</div>
		</div>
	)
}

function Sidebar(props: { topics?: string[] }) {
	const [expanded, setExpanded] = createSignal(false)
	const [expandTimer, setExpandTimer] = createSignal(false)
	return (
		<div class="fixed top-0 left-0 flex justify-between flex-col h-screen min-w-[200px] bg-dark text-textGray">
			<div class="">
				<div class="h-[40px] w-[40px] rounded-full bg-white m-[20px]"></div>
				<div class="col-gap-[8px] pl-2">
					<div class="w-full [&>*]:p-4 [&>*]:flex [&>*]:items-center [&>*]:px-[11px]">
						<Button label="My Links" />
					</div>
					<div class="">
						<div class="text-white/20 text-[14px] px-3 p-2">My Topics</div>
						<For each={props.topics}>
							{(topic) => {
								return (
									<div class="text-white/60 px-3 p-2 cursor-pointer hover:bg-hoverDark rounded-[7px] transition-all">
										{topic}
									</div>
								)
							}}
						</For>
					</div>
				</div>
			</div>
			<div class="relative">
				<div
					onClick={() => {
						setExpanded(!expanded())
					}}
					onMouseLeave={() => {
						setExpandTimer(true)
						setTimeout(() => {
							if (expandTimer()) {
								setExpanded(false)
							}
						}, 500)
					}}
					onMouseEnter={() => {
						setExpandTimer(false)
					}}
					class="p-4"
				>
					Profile
				</div>
				<Show when={expanded()}>
					<Motion.div
						exit={{ opacity: 0, scale: 0.8 }}
						animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1] }}
						transition={{ duration: 0.2, easing: "ease-in" }}
						class="absolute bottom-12 w-full min-w-fit left-[6px] bg-hoverDark p-1 rounded-[7px]"
						style={{
							border: "1px solid #1E1E1E",
							background: "rgba(55, 55, 55, 0.40)",
							"backdrop-filter": "blur(8.5px)",
						}}
					>
						<div class="rounded-[7px] h-[34px] cursor-pointer whitespace-nowrap px-[11px] flex items-center hover:bg-softDarkText/10 text-white/60">
							Settings
						</div>
						<div class="rounded-[7px] h-[34px] cursor-pointer whitespace-nowrap px-[11px] flex items-center hover:bg-softDarkText/10 text-white/60">
							Support
						</div>
						<div class="rounded-[7px] h-[34px] cursor-pointer whitespace-nowrap px-[11px] flex items-center hover:bg-softDarkText/10 text-white/60">
							Sign out
						</div>
					</Motion.div>
				</Show>
			</div>
		</div>
	)
}
