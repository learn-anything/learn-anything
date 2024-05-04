import clsx from "clsx"
import { For, Show, createSignal } from "solid-js"
import { Motion, Presence } from "solid-motionone"
import { useNavigate } from "@solidjs/router"
import Icon from "./Icon"

export function Sidebar(props: {
	personalPages: { title: string; pageUrl: string }[]
	// setMode: (value: string) => void
	// mode: string
	// currentPage: string
	// setCurrentPage: (value: string) => void
}) {
	const [expanded, setExpanded] = createSignal(false)
	const [expandTimer, setExpandTimer] = createSignal(false)
	const navigate = useNavigate()

	return (
		<div class="fixed top-0 left-0 flex flex-col justify-between h-screen min-w-[200px] bg-dark text-textGray ">
			<div>
				<div class="flex-between m-[20px] mr-[2px]">
					<div class="h-[40px] w-[40px] rounded-full bg-white"></div>
					<div
						class="px-[15px] h-[40px] flex-center rounded-[7px] text-white/30 bg-hoverDark "
						onClick={() => {
							navigate("/Search")
						}}
					>
						{/* {props.mode === "Search" ? "Back" : "Search"} */}
						Search
					</div>
				</div>
				<div class="col-gap-[8px] pl-2">
					<div class="cursor-pointer px-3 text-white/60 p-[6px] rounded-[7px] transition-all">
						Inbox
					</div>
					<div
						class={clsx(
							"cursor-pointer px-3 text-white/60 p-[6px] rounded-[7px] transition-all",
							// props.currentPage === "MyLinks" && "button",
						)}
						onClick={() => {
							// props.setCurrentPage("MyLinks")
						}}
					>
						Links
					</div>
					<div class="">
						<div class="flex-between text-white/40">
							<div class="text-white/20 text-[14px] px-3 p-2">Pages</div>
							<div
								onClick={() => {
									// props.setMode("Page")
									// props.setCurrentPage("")
								}}
							>
								<Icon name="Plus" />
							</div>
						</div>
						<For each={props.personalPages}>
							{(page) => {
								return (
									<div
										onClick={() => {
											// props.setCurrentPage(page)
											// props.setMode("Page")
										}}
										class={clsx(
											"text-white/60 px-3 p-[6px] cursor-pointer mb-[2px] hover:bg-hoverDark rounded-[7px] transition-all",
											// props.currentPage === page && "button",
										)}
									>
										{page.title}
									</div>
								)
							}}
						</For>
					</div>
				</div>
			</div>
			<div
				class="relative"
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
			>
				<div class="p-4">Profile</div>
				<Presence>
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
							<div
								onClick={() => {
									// props.setMode("Profile")
									// props.setCurrentPage("Profile")
								}}
								class="rounded-[7px] h-[34px] cursor-pointer whitespace-nowrap px-[11px] flex items-center hover:bg-softDarkText/10 text-white/60"
							>
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
				</Presence>
			</div>
		</div>
	)
}
